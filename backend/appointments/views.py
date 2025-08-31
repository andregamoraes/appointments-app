# backend/appointments/views.py
from datetime import datetime, date, time, timedelta

from django.utils import timezone
from django.db import transaction
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework import serializers

from .models import Contract, Appointment, ContractType
from .serializers import BookingCreateSerializer
from users.auth import JWTAuthentication 

class AvailableSlotsView(APIView):
    """
    GET /api/appointments/slots/?therapist_id=123&date=2025-09-01
    Retorna: {"date": "...", "therapist_id": 123, "available": ["08:00", ...]}
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    # regras do consultório
    START_AT = time(8, 0)      # 08:00
    END_AT   = time(18, 0)     # 18:00
    STEP_MIN = 40              # intervalo de 40min

    def _base_slots(self) -> list[str]:
        """Gera a grade base ['08:00', '08:40', ..., '18:00']"""
        slots = []
        # usa a data de hoje só para somar horas (o dia em si não importa)
        dt = datetime.combine(date.today(), self.START_AT)
        end = datetime.combine(date.today(), self.END_AT)
        while dt <= end:
            slots.append(dt.strftime("%H:%M"))
            dt += timedelta(minutes=self.STEP_MIN)
        return slots

    def get(self, request):
        dstr = request.query_params.get("date")
        therapist_id = request.query_params.get("therapist_id")

        if not dstr or not therapist_id:
            return Response(
                {"detail": "Parâmetros obrigatórios: date=YYYY-MM-DD e therapist_id."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            day = datetime.strptime(dstr, "%Y-%m-%d").date()
        except ValueError:
            return Response({"detail": "Formato de data inválido. Use YYYY-MM-DD."},
                            status=status.HTTP_400_BAD_REQUEST)

        qs = (
            Appointment.objects
            .filter(contract__therapist_id=therapist_id, start__date=day)
            .values_list("start", flat=True)
        )

        # normaliza p/ timezone atual e extrai HH:MM
        tz = timezone.get_current_timezone()
        booked = {
            timezone.localtime(dt, tz).strftime("%H:%M")
            for dt in qs
        }

        base = self._base_slots()
        available = [hhmm for hhmm in base if hhmm not in booked]

        return Response({
            "date": day.isoformat(),
            "therapist_id": int(therapist_id), ##Precisa?
            "available": available
        })

class BookingCreateView(APIView):
    """
    POST /api/appointments/
    body: {"therapist_id": 5, "plan": "QUINZENAL"|"SEMANAL"|"AVULSO", "start": "2025-09-10T10:00:00"}
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    SESSION_MINUTES = 40

    @transaction.atomic
    def post(self, request):
        s = BookingCreateSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        patient = request.user
        therapist_id = s.validated_data["therapist_id"]
        plan = s.validated_data["plan"]
        start = s.validated_data["start"]

        try:
            contract = Contract.objects.create(
                patient_id=patient.id,
                therapist_id=therapist_id,
                type=plan,
                first_session_at=start,
                is_active=True,
            )
        except IntegrityError as e:
            return Response(
                {"detail": "Erro ao criar contrato. Verifique os dados enviados."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        end = start + timedelta(minutes=self.SESSION_MINUTES)

        created_ids = []
        def _create_slot(dt):
            conflict = Appointment.objects.filter(
                contract__therapist_id=therapist_id,
                start=dt
            ).exists()

            if conflict:
                raise serializers.ValidationError(
                    {"detail": "Conflito de horários para o terapeuta. Escolha outro horário ou plano."}
                )

            ap = Appointment.objects.create(contract=contract, start=dt)
            return ap.id

        try:
            if plan == ContractType.AVULSO:
                created_ids.append(_create_slot(start))
            elif plan == ContractType.SEMANAL:
                for i in range(26):
                    created_ids.append(_create_slot(start + timedelta(weeks=i)))
            elif plan == ContractType.QUINZENAL:
                for i in range(13):
                    created_ids.append(_create_slot(start + timedelta(weeks=2*i)))
            else:
                return Response({"detail": "Plano inválido"}, status=400)

        except serializers.ValidationError as e:
            return Response(e.detail, status=409)  # conflito

        last = Appointment.objects.filter(contract=contract).order_by("-start").first()
        if last:
            contract.last_session_at = last.start
            contract.save(update_fields=["last_session_at"])

        return Response({
            "status": "ok",
        }, status=status.HTTP_201_CREATED)

class DashboardSummaryView(APIView):
    """
    GET /api/appointments/summary/
    -> { "active_plan": {...} | null, "next_appointment": {...} | null }
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        now = timezone.now()

        active_plan = (
            Contract.objects
            .select_related("therapist")
            .filter(patient_id=user.id, is_active=True, last_session_at__gte=now)
            .order_by("-created_at")
            .values(
                "id",
                "type",
                "therapist__name",
            )
            .first()
        )
        if active_plan:
            active_plan["therapist_name"] = active_plan.pop("therapist__name")

        next_appts_qs = (
            Appointment.objects
            .filter(contract__patient_id=user.id, start__gte=now)
            .select_related("contract")
            .order_by("start")[:2]
            .values(
                "id",
                "start",
            )
        )
        next_appointments = list(next_appts_qs)

        return Response({
            "active_plan": active_plan,
            "next_appointments": next_appointments,
        })


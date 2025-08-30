# backend/appointments/serializers.py
from rest_framework import serializers
from django.utils import timezone
from .models import Contract, Appointment, ContractType

# class PlanContractSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Contract
#         fields = ["id", "type", "patient_id", "therapist_id",
#                   "created_at", "first_session_at", "last_session_at", "is_active"]
#         ##read_only_fields = ["created_at", "first_session_at", "last_session_at", "is_active"]

# class AppointmentCreateSerializer(serializers.ModelSerializer):
#     # Na criação pelo app, você pode aceitar start + (opcional) duração
#     plan = serializers.PrimaryKeyRelatedField(source="contract", queryset=ContractType.objects.all())

#     class Meta:
#         model = Appointment
#         fields = ["id", "plan", "start"]

# class AppointmentListSerializer(serializers.ModelSerializer):
#     therapist_id = serializers.IntegerField(source="contract.therapist_id", read_only=True)
#     patient_id   = serializers.IntegerField(source="contract.patient_id", read_only=True)
#     plan_type    = serializers.CharField(source="contract.type", read_only=True)

#     class Meta:
#         model = Appointment
#         fields = ["id", "start", "therapist_id", "patient_id", "plan_type"]

class BookingCreateSerializer(serializers.Serializer):
    therapist_id = serializers.IntegerField()
    plan = serializers.ChoiceField(choices=ContractType.choices)
    start = serializers.DateTimeField()  # ISO: "YYYY-MM-DDTHH:MM:SS"
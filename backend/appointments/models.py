from django.db import models
from django.conf import settings
from django.utils import timezone

User = settings.AUTH_USER_MODEL

class ContractType(models.TextChoices):
    AVULSO = "AVULSO"
    QUINZENAL = "QUINZENAL"
    SEMANAL = "SEMANAL"

class Contract(models.Model):
    patient = models.ForeignKey(User, on_delete=models.PROTECT, related_name="plan_contracts_as_patient")
    therapist = models.ForeignKey(User, on_delete=models.PROTECT, related_name="plan_contracts_as_therapist")
    type = models.CharField(max_length=20, choices=ContractType.choices)

    created_at = models.DateTimeField(default=timezone.now)
    first_session_at = models.DateTimeField(null=True, blank=True)
    last_session_at  = models.DateTimeField(null=True, blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        indexes = [
            models.Index(fields=["patient"]),
            models.Index(fields=["therapist"]),
            models.Index(fields=["type"]),
        ]

    def __str__(self):
        return f"{self.patient} -> {self.therapist} [{self.type}]"

class Appointment(models.Model):
    """Evento do calendário vinculado ao contrato"""
    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="appointments")
    start = models.DateTimeField()
    created_at = models.DateTimeField(default=timezone.now)
    canceled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["start"]
        indexes = [
            models.Index(fields=["start"]),
            models.Index(fields=["contract"]),
        ]

    def __str__(self):
        return f"{self.contract} @ {self.start.isoformat()}"

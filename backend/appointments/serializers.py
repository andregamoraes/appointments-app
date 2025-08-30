# backend/appointments/serializers.py
from rest_framework import serializers
from django.utils import timezone
from .models import Contract, Appointment, ContractType

class BookingCreateSerializer(serializers.Serializer):
    therapist_id = serializers.IntegerField()
    plan = serializers.ChoiceField(choices=ContractType.choices)
    start = serializers.DateTimeField()  # ISO: "YYYY-MM-DDTHH:MM:SS"
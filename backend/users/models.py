from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    class UserType(models.TextChoices):
        PATIENT = "PATIENT"
        THERAPIST = "THERAPIST"

    # sobrescrevendo username → vamos usar email
    username = None
    first_name = None
    last_name = None
    email = models.EmailField(unique=True)

    # campos customizados
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=20, choices=UserType.choices)
    description = models.CharField(max_length=10000, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "type"]

    def soft_delete(self):
        self.deleted_at = timezone.now()
        self.save()

    def __str__(self):
        return f"{self.name} ({self.type})"

# users/management/commands/seed_demo.py
from django.core.management.base import BaseCommand
from django.conf import settings
from users.models import User

DEFAULT_PWD = "test1234"

class Command(BaseCommand):
    help = "Seed demo users (1 patient + 5 therapists). Safe to run multiple times."

    def handle(self, *args, **options):
        # Paciente de teste
        patient, created = User.objects.get_or_create(
            email="patient@example.com",
            defaults={
                "name": "Test Patient",
                "type": User.UserType.PATIENT,
            },
        )
        if created or not patient.has_usable_password():
            patient.set_password(DEFAULT_PWD)
            patient.save(update_fields=["password"])
        self.stdout.write(self.style.SUCCESS(f"Patient: {patient.email} / {DEFAULT_PWD}"))

        # 5 terapeutas mock
        for i in range(1, 6):
            email = f"therapist{i}@example.com"
            therapist, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "name": f"Therapist {i}",
                    "type": User.UserType.THERAPIST,
                    "description": "Sou psicólogo com experiência em terapia cognitivo-comportamental. Ajudo meus pacientes a superar desafios emocionais e melhorar sua qualidade de vida.",
                },
            )
            if created or not therapist.has_usable_password():
                therapist.set_password(DEFAULT_PWD)
                therapist.save(update_fields=["password"])
            self.stdout.write(self.style.SUCCESS(f"Therapist {i}: {email} / {DEFAULT_PWD}"))

        # # (Opcional) superuser para /admin
        # if not User.objects.filter(email="admin@example.com").exists():
        #     admin = User.objects.create(
        #         email="admin@example.com",
        #         name="Admin",
        #         type=User.UserType.PATIENT,
        #         is_staff=True,
        #         is_superuser=True,
        #     )
        #     admin.set_password(DEFAULT_PWD)
        #     admin.save(update_fields=["password"])
        #     self.stdout.write(self.style.SUCCESS(f"Admin: admin@example.com / {DEFAULT_PWD}"))

        self.stdout.write(self.style.SUCCESS("Demo users seeded."))

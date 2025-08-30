import time
import jwt
from django.conf import settings
from django.contrib.auth import authenticate, get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import LoginSerializer

from rest_framework.permissions import IsAuthenticated
from .auth import JWTAuthentication



User = get_user_model()

class LoginView(APIView):
    """
    POST /api/auth/login/
    body: {"email": "...", "password": "..."}
    retorna: {"access": "<jwt>", "user": {"id":..., "type": "...", "name": "..."}}
    """

    authentication_classes = []
    permission_classes = []

    def post(self, request):
        s = LoginSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        email = s.validated_data["email"]
        password = s.validated_data["password"]

        # IMPORTANTE: authenticate usa o USERNAME_FIELD do seu User (email)
        user = authenticate(request, username=email, password=password)
        if not user:
            return Response({"detail": "invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        # opcional: bloquear soft-deleted/inativos
        if getattr(user, "deleted_at", None) is not None or not user.is_active:
            return Response({"detail": "user inactive"}, status=status.HTTP_403_FORBIDDEN)

        now = int(time.time())
        payload = {
            "sub": str(user.id),          # id do usuário
            "type": user.type,        # PATIENT | THERAPIST
            "iat": now,               # emitido em
            ##"exp": now + settings.JWT_EXPIRES_SECONDS,  # se quiser expiração
            "iss": "appointments-api",
        }
        token = jwt.encode(payload, settings.JWT_SECRET, algorithm=getattr(settings, "JWT_ALG", "HS256"))

        return Response({
            "access": token,
            "user": {
                "id": user.id,
                "type": user.type,
                "name": user.name,
                "email": user.email,
            }
        })

class UsersListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = User.objects.all()

        user_type = request.query_params.get("type")
        if user_type:
            qs = qs.filter(type=user_type)


        data = qs.values("id", "name", "type", "description")
        return Response(list(data))

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework import exceptions

User = get_user_model()

class JWTAuthentication(BaseAuthentication):
    """Valida Bearer JWT gerado no LoginView e popula request.user"""
    def authenticate(self, request):
        auth = get_authorization_header(request).split()
        if not auth or auth[0].lower() != b"bearer":
            return None  # sem header → DRF tenta outras auths (ou 401 se exigir)
        if len(auth) != 2:
            raise exceptions.AuthenticationFailed("Invalid Authorization header")

        token = auth[1].decode("utf-8")
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[getattr(settings, "JWT_ALG", "HS256")])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

        user_id = payload.get("sub")
        if isinstance(user_id, str):
            try:
                user_id = int(user_id)
            except ValueError:
                raise exceptions.AuthenticationFailed("Invalid subject")
        elif not isinstance(user_id, int):
            raise exceptions.AuthenticationFailed("Invalid subject")

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found")

        # opcional: bloquear soft-deleted/inativos
        if getattr(user, "deleted_at", None) is not None or not user.is_active:
            raise exceptions.AuthenticationFailed("User inactive")

        # retorna (user, auth) → DRF coloca em request.user / request.auth
        return (user, payload)

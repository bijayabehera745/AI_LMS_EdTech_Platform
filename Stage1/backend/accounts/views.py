"""
accounts/views.py

Endpoints:
    POST   /api/v1/auth/register/        → create account, return JWT tokens
    POST   /api/v1/auth/login/           → return JWT access + refresh + student info
    POST   /api/v1/auth/token/refresh/   → refresh access token
    GET    /api/v1/auth/profile/         → get logged-in student's profile
    PATCH  /api/v1/auth/profile/         → update name or grade
"""

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .models import Student
from .serializers import RegisterSerializer, StudentProfileSerializer, CustomTokenObtainPairSerializer


class RegisterView(APIView):
    """POST /api/v1/auth/register/ — open to unauthenticated users."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            student = serializer.save()
            # Return tokens immediately so the frontend can log in straight away
            from rest_framework_simplejwt.tokens import RefreshToken
            refresh = RefreshToken.for_user(student)
            return Response(
                {
                    'message': 'Account created successfully.',
                    'student': StudentProfileSerializer(student).data,
                    'tokens': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh),
                    },
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    """
    POST /api/v1/auth/login/
    Returns access token, refresh token, AND student profile in one response.
    """
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer


class ProfileView(APIView):
    """GET / PATCH /api/v1/auth/profile/ — requires valid JWT."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = StudentProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = StudentProfileSerializer(
            request.user,
            data=request.data,
            partial=True,
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

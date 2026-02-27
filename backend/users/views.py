from django.conf import settings
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from core.permissions import IsAdmin, IsHROrAdmin
from .models import CustomUser
from .serializers import (
    LoginSerializer,
    HRUserSerializer,
    HRUserUpdateSerializer,
    HRUserListSerializer,
)


def _set_jwt_cookies(response: Response, user) -> Response:
    """Set JWT access and refresh tokens as HTTP-only cookies."""
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    response.set_cookie(
        key=settings.JWT_AUTH_COOKIE,
        value=access_token,
        httponly=True,
        secure=not settings.DEBUG,
        samesite='Lax',
        max_age=int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
    )
    response.set_cookie(
        key=settings.JWT_AUTH_REFRESH_COOKIE,
        value=refresh_token,
        httponly=True,
        secure=not settings.DEBUG,
        samesite='Lax',
        max_age=int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
    )
    return response


class HRLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        if user.role != 'hr':
            return Response({'detail': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        response = Response({'message': 'Login successful.', 'role': user.role})
        return _set_jwt_cookies(response, user)


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        if user.role != 'admin':
            return Response({'detail': 'Access denied.'}, status=status.HTTP_403_FORBIDDEN)

        response = Response({'message': 'Login successful.', 'role': user.role})
        return _set_jwt_cookies(response, user)


class LogoutView(APIView):
    permission_classes = [IsHROrAdmin]

    def post(self, request):
        response = Response({'message': 'Logged out.'})
        response.delete_cookie(settings.JWT_AUTH_COOKIE)
        response.delete_cookie(settings.JWT_AUTH_REFRESH_COOKIE)
        return response


class HRUserListCreateView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        users = CustomUser.objects.filter(role='hr').order_by('-created_at')
        serializer = HRUserListSerializer(users, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = HRUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(HRUserListSerializer(user).data, status=status.HTTP_201_CREATED)


class HRUserDetailView(APIView):
    permission_classes = [IsAdmin]

    def _get_hr_user(self, pk):
        try:
            return CustomUser.objects.get(pk=pk, role='hr')
        except CustomUser.DoesNotExist:
            return None

    def patch(self, request, pk):
        user = self._get_hr_user(pk)
        if not user:
            return Response({'detail': 'HR user not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = HRUserUpdateSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(HRUserListSerializer(user).data)


class AdminOverviewView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        from complaints.models import Complaint
        total_hr = CustomUser.objects.filter(role='hr').count()
        active_hr = CustomUser.objects.filter(role='hr', is_active=True).count()
        total_complaints = Complaint.objects.count()
        by_status = {
            'Open': Complaint.objects.filter(status='Open').count(),
            'Under Review': Complaint.objects.filter(status='Under Review').count(),
            'Resolved': Complaint.objects.filter(status='Resolved').count(),
        }
        return Response({
            'total_hr_users': total_hr,
            'active_hr_users': active_hr,
            'total_complaints': total_complaints,
            'complaints_by_status': by_status,
        })

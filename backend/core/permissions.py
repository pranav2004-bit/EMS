from rest_framework.permissions import BasePermission


class IsHR(BasePermission):
    """Allows access only to authenticated users with role='hr'."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'hr'
            and request.user.is_active
        )


class IsAdmin(BasePermission):
    """Allows access only to authenticated users with role='admin'."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'admin'
            and request.user.is_active
        )


class IsHROrAdmin(BasePermission):
    """Allows access to authenticated users with role='hr' or 'admin'."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('hr', 'admin')
            and request.user.is_active
        )

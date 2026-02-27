from django.urls import path
from .views import (
    HRLoginView,
    AdminLoginView,
    LogoutView,
    HRUserListCreateView,
    HRUserDetailView,
    AdminOverviewView,
)

urlpatterns = [
    # Auth
    path('hr/login', HRLoginView.as_view(), name='hr-login'),
    path('admin/login', AdminLoginView.as_view(), name='admin-login'),
    path('auth/logout', LogoutView.as_view(), name='logout'),
    # Admin — HR management
    path('admin/hr-users', HRUserListCreateView.as_view(), name='hr-users'),
    path('admin/hr-users/<uuid:pk>', HRUserDetailView.as_view(), name='hr-user-detail'),
    # Admin overview
    path('admin/overview', AdminOverviewView.as_view(), name='admin-overview'),
]

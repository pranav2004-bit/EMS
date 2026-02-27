from django.urls import path
from .views import AnalyticsView

urlpatterns = [
    path('hr/analytics', AnalyticsView.as_view(), name='hr-analytics'),
]

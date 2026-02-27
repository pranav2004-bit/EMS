from django.urls import path
from .views import (
    AccessKeyValidateView,
    ComplaintSubmitView,
    ComplaintTrackView,
    HRComplaintListView,
    HRComplaintDetailView,
    SignedURLView,
)

urlpatterns = [
    # Public
    path('access-key/validate', AccessKeyValidateView.as_view(), name='access-key-validate'),
    path('complaints/', ComplaintSubmitView.as_view(), name='complaint-submit'),
    path('complaints/track/<uuid:case_id>/', ComplaintTrackView.as_view(), name='complaint-track'),
    # HR
    path('hr/complaints', HRComplaintListView.as_view(), name='hr-complaints'),
    path('hr/complaints/<uuid:pk>', HRComplaintDetailView.as_view(), name='hr-complaint-detail'),
    # Signed URL (HR/Admin)
    path('complaints/attachments/<uuid:attachment_id>/signed-url', SignedURLView.as_view(), name='signed-url'),
]

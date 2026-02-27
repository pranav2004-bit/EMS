import uuid
from django.conf import settings
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from core.permissions import IsHROrAdmin
from core.storage import SupabaseStorage
from core.utils import classify_severity, validate_file
from .models import Complaint, ComplaintAttachment
from .serializers import (
    ComplaintSubmitSerializer,
    ComplaintListSerializer,
    ComplaintDetailSerializer,
    ComplaintTrackSerializer,
    ComplaintStatusUpdateSerializer,
)


class AccessKeyValidateView(APIView):
    permission_classes = [AllowAny]

    @method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True))
    def post(self, request):
        submitted_key = request.data.get('access_key', '').strip()
        if not submitted_key:
            return Response(
                {'valid': False, 'detail': 'Access key is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if submitted_key == settings.ACCESS_KEY_VALUE:
            return Response({'valid': True})
        return Response(
            {'valid': False, 'detail': 'Invalid access key.'},
            status=status.HTTP_401_UNAUTHORIZED
        )


class ComplaintSubmitView(APIView):
    permission_classes = [AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def post(self, request):
        data = request.data.dict() if hasattr(request.data, 'dict') else dict(request.data)

        # Handle impact_flags if sent as comma-separated string
        if 'impact_flags' in data and isinstance(data['impact_flags'], str):
            import json
            try:
                data['impact_flags'] = json.loads(data['impact_flags'])
            except ValueError:
                data['impact_flags'] = [f.strip() for f in data['impact_flags'].split(',') if f.strip()]

        serializer = ComplaintSubmitSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        severity = classify_severity(
            serializer.validated_data.get('urgency_level', 'Medium'),
            serializer.validated_data.get('impact_flags', [])
        )
        complaint = serializer.save(severity=severity)

        # Handle optional file attachments
        files = request.FILES.getlist('attachments')
        for file_obj in files:
            valid, error_msg = validate_file(file_obj)
            if not valid:
                complaint.delete()
                return Response({'detail': error_msg}, status=status.HTTP_400_BAD_REQUEST)

            storage_path = f'{complaint.case_id}/{uuid.uuid4()}_{file_obj.name}'
            try:
                SupabaseStorage.upload_file(file_obj, storage_path, file_obj.content_type)
            except Exception as e:
                complaint.delete()
                return Response({'detail': 'File upload failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            ComplaintAttachment.objects.create(
                complaint=complaint,
                file_name=file_obj.name,
                file_path=storage_path,
                file_type=file_obj.content_type,
                file_size=file_obj.size,
            )

        # Return ONLY case_id
        return Response({'case_id': str(complaint.case_id)}, status=status.HTTP_201_CREATED)


class ComplaintTrackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, case_id):
        try:
            uuid.UUID(str(case_id))
        except ValueError:
            return Response({'detail': 'Invalid Case ID format.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            complaint = Complaint.objects.get(case_id=case_id)
        except Complaint.DoesNotExist:
            return Response({'detail': 'Case not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ComplaintTrackSerializer(complaint)
        return Response(serializer.data)


class HRComplaintListView(APIView):
    permission_classes = [IsHROrAdmin]

    def get(self, request):
        qs = Complaint.objects.all()

        # Filtering
        status_filter = request.query_params.get('status')
        category_filter = request.query_params.get('category')
        urgency_filter = request.query_params.get('urgency_level')
        search = request.query_params.get('search')

        if status_filter:
            qs = qs.filter(status=status_filter)
        if category_filter:
            qs = qs.filter(category__icontains=category_filter)
        if urgency_filter:
            qs = qs.filter(urgency_level=urgency_filter)
        if search:
            qs = qs.filter(case_id__icontains=search)

        # Pagination via DRF
        from rest_framework.pagination import PageNumberPagination
        paginator = PageNumberPagination()
        paginator.page_size = 20
        page = paginator.paginate_queryset(qs, request)
        serializer = ComplaintListSerializer(page, many=True)
        return paginator.get_paginated_response(serializer.data)


class HRComplaintDetailView(APIView):
    permission_classes = [IsHROrAdmin]

    def _get_complaint(self, pk):
        try:
            return Complaint.objects.get(pk=pk)
        except Complaint.DoesNotExist:
            return None

    def get(self, request, pk):
        complaint = self._get_complaint(pk)
        if not complaint:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(ComplaintDetailSerializer(complaint).data)

    def patch(self, request, pk):
        complaint = self._get_complaint(pk)
        if not complaint:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ComplaintStatusUpdateSerializer(
            complaint, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ComplaintDetailSerializer(complaint).data)


class SignedURLView(APIView):
    permission_classes = [IsHROrAdmin]

    def get(self, request, attachment_id):
        try:
            attachment = ComplaintAttachment.objects.get(pk=attachment_id)
        except ComplaintAttachment.DoesNotExist:
            return Response({'detail': 'Attachment not found.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            signed_url = SupabaseStorage.generate_signed_url(attachment.file_path, expires_in=3600)
        except Exception:
            return Response({'detail': 'Could not generate signed URL.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'signed_url': signed_url, 'expires_in': 3600})

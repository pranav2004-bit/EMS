from django.db.models import Count
from django.db.models.functions import TruncMonth
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from core.permissions import IsHROrAdmin
from complaints.models import Complaint


class AnalyticsView(APIView):
    permission_classes = [IsHROrAdmin]

    def get(self, request):
        qs = Complaint.objects.all()

        # Optional date range filter
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        category = request.query_params.get('category')

        if start_date:
            qs = qs.filter(created_at__date__gte=start_date)
        if end_date:
            qs = qs.filter(created_at__date__lte=end_date)
        if category:
            qs = qs.filter(category__icontains=category)

        # Volume by category
        volume_by_category = list(
            qs.values('category')
            .annotate(count=Count('id'))
            .order_by('-count')
        )

        # Status distribution
        status_distribution = list(
            qs.values('status')
            .annotate(count=Count('id'))
            .order_by('status')
        )

        # Monthly trend
        monthly_trend = list(
            qs.annotate(month=TruncMonth('created_at'))
            .values('month')
            .annotate(count=Count('id'))
            .order_by('month')
        )
        # Serialize month to string
        for item in monthly_trend:
            item['month'] = item['month'].strftime('%Y-%m') if item['month'] else None

        # Resolution rate
        total = qs.count()
        resolved = qs.filter(status='Resolved').count()
        resolution_rate = round((resolved / total * 100), 2) if total > 0 else 0.0

        return Response({
            'volume_by_category': volume_by_category,
            'status_distribution': status_distribution,
            'monthly_trend': monthly_trend,
            'resolution_rate': resolution_rate,
            'total_complaints': total,
            'resolved_complaints': resolved,
        })

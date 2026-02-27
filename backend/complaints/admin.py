from django.contrib import admin
from .models import Complaint, ComplaintAttachment


@admin.register(Complaint)
class ComplaintAdmin(admin.ModelAdmin):
    list_display = ['case_id', 'category', 'status', 'urgency_level', 'severity', 'created_at']
    list_filter = ['status', 'urgency_level', 'category']
    search_fields = ['case_id']
    readonly_fields = ['case_id', 'created_at', 'updated_at']


@admin.register(ComplaintAttachment)
class ComplaintAttachmentAdmin(admin.ModelAdmin):
    list_display = ['file_name', 'complaint', 'file_type', 'uploaded_at']
    readonly_fields = ['uploaded_at']

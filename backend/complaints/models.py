import uuid
from django.db import models


class Complaint(models.Model):
    STATUS_CHOICES = [
        ('Open', 'Open'),
        ('Under Review', 'Under Review'),
        ('Resolved', 'Resolved'),
    ]
    URGENCY_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
        ('Critical', 'Critical'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    case_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False, db_index=True)
    category = models.CharField(max_length=100)
    title = models.CharField(max_length=500)
    description = models.TextField()
    incident_date = models.DateField()
    location = models.CharField(max_length=255)
    accused_name = models.CharField(max_length=255, blank=True, default='')
    accused_role = models.CharField(max_length=255, blank=True, default='')
    impact_flags = models.JSONField(default=list)
    urgency_level = models.CharField(max_length=20, choices=URGENCY_CHOICES, default='Medium')
    severity = models.CharField(max_length=20, blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Open')
    resolution_note = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'complaints'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.case_id} - {self.status}'


class ComplaintAttachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    complaint = models.ForeignKey(
        Complaint, on_delete=models.CASCADE, related_name='attachments'
    )
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=1024)  # Supabase storage path only
    file_type = models.CharField(max_length=100)
    file_size = models.PositiveBigIntegerField()  # in bytes
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'complaint_attachments'

    def __str__(self):
        return f'{self.file_name} → {self.complaint.case_id}'

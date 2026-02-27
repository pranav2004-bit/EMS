from rest_framework import serializers
from .models import Complaint, ComplaintAttachment


class ComplaintAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplaintAttachment
        fields = ['id', 'file_name', 'file_type', 'file_size', 'uploaded_at']


class ComplaintSubmitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = [
            'category', 'title', 'description', 'incident_date',
            'location', 'accused_name', 'accused_role',
            'impact_flags', 'urgency_level',
        ]

    def validate_category(self, value):
        if not value.strip():
            raise serializers.ValidationError('Category is required.')
        return value.strip()

    def validate_title(self, value):
        if not value.strip():
            raise serializers.ValidationError('Title is required.')
        return value.strip()

    def validate_description(self, value):
        if len(value.strip()) < 20:
            raise serializers.ValidationError('Description must be at least 20 characters.')
        return value.strip()

    def validate_impact_flags(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError('impact_flags must be a list.')
        return value


class ComplaintListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = [
            'id', 'case_id', 'category', 'title', 'status',
            'urgency_level', 'severity', 'created_at',
        ]


class ComplaintDetailSerializer(serializers.ModelSerializer):
    attachments = ComplaintAttachmentSerializer(many=True, read_only=True)

    class Meta:
        model = Complaint
        fields = [
            'id', 'case_id', 'category', 'title', 'description',
            'incident_date', 'location', 'accused_name', 'accused_role',
            'impact_flags', 'urgency_level', 'severity', 'status',
            'resolution_note', 'created_at', 'updated_at', 'attachments',
        ]


class ComplaintTrackSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['case_id', 'status', 'resolution_note', 'created_at', 'updated_at']


class ComplaintStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Complaint
        fields = ['status', 'resolution_note']

    def validate_status(self, value):
        from core.utils import is_valid_transition
        current = self.instance.status if self.instance else None
        if current and not is_valid_transition(current, value):
            raise serializers.ValidationError(
                f'Invalid transition: "{current}" → "{value}".'
            )
        return value

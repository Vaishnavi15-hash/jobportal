from rest_framework import serializers
from .models import Application, Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'location', 'job_type', 'is_active', 'application_deadline']

class ApplicationSerializer(serializers.ModelSerializer):
    job = JobSerializer(read_only=True)   # ✅ Nested serializer
    applicant = serializers.StringRelatedField(read_only=True)  # Optional: shows applicant username

    class Meta:
        model = Application
        fields = ['id', 'job', 'resume', 'cover_letter', 'applied_at', 'applicant']
        read_only_fields = ['applicant', 'applied_at']

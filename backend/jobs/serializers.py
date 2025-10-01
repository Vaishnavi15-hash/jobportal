from rest_framework import serializers
from .models import Job

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'requirements', 'location', 
                 'job_type', 'application_deadline', 'created_at', 'updated_at', 'is_active']
        # Exclude 'employer' field - it will be set automatically by the view
from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, 
        required=True, 
        
    )

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'role', 'is_staff', 'is_active']

    def create(self, validated_data):
        user = User(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data.get('role', 'jobseeker')  # default to jobseeker if not passed
        )
        user.set_password(validated_data['password'])  # ✅ hashes password
        user.save()
        return user

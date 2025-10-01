from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Job
from .serializers import JobSerializer
from django.middleware.csrf import get_token
from django.http import JsonResponse

class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Job.objects.filter(is_active=True).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(employer=self.request.user)

class JobDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Job.objects.all()

def get_csrf_token(request):
    token = get_token(request)
    return JsonResponse({'csrfToken': token})
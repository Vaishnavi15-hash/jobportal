from rest_framework import generics, permissions
from .models import Application
from .serializers import ApplicationSerializer

# List all applications of the logged-in user OR create a new application
class ApplicationListCreateView(generics.ListCreateAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "jobseeker":
            # Job seeker sees only their applications
            return Application.objects.filter(applicant=user)
        elif user.role == "employer":
            # Employer sees applications for their jobs
            return Application.objects.filter(job__employer=user)
        return Application.objects.none()

    def perform_create(self, serializer):
        # Automatically set the applicant to the logged-in user
        serializer.save(applicant=self.request.user)


# Retrieve, update, or delete a specific application
class ApplicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "jobseeker":
            return Application.objects.filter(applicant=user)
        elif user.role == "employer":
            return Application.objects.filter(job__employer=user)
        return Application.objects.none()

from django.urls import path
from .views import JobListCreateView, JobDetailView, get_csrf_token

urlpatterns = [
    path('', JobListCreateView.as_view(), name='job-list-create'),  # /api/jobs/
    path('<int:pk>/', JobDetailView.as_view(), name='job-detail'),  # /api/jobs/1/
    path('csrf/', get_csrf_token, name='csrf'),
]
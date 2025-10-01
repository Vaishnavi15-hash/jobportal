from django.db import models

# Create your models here.
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ("jobseeker", "Job Seeker"),
        ("employer", "Employer"),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

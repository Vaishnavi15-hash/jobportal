from django.db import models

# Create your models here.
from django.db import models
from users.models import User
from jobs.models import Job

class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name="applications")
    resume = models.TextField(blank=True)  # can later upload file
    cover_letter = models.TextField(blank=True)
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant.username} -> {self.job.title}"

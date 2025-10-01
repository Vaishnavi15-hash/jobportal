from django.db import models
from django.conf import settings

class Job(models.Model):
    # Employer who posted the job (links to User model)
    employer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="jobs"
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    requirements = models.TextField()
    location = models.CharField(max_length=255)
    job_type = models.CharField(
        max_length=50,
        choices=[
            ("full-time", "Full-Time"),
            ("part-time", "Part-Time"),
            ("internship", "Internship"),
            ("contract", "Contract"),
        ],
        default="full-time"
    )
    application_deadline = models.DateField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_active = models.BooleanField(default=True)  # mark as filled/closed

    def __str__(self):
        return f"{self.title} at {self.location}"


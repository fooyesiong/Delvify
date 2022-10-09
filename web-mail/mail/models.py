from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class List(models.Model):
    name = models.CharField(max_length=255)
    body = models.TextField(blank=True)
    description = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    deadline = models.CharField(max_length=255)
    deleted = models.BooleanField(default=False)

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "deadline": self.deadline,
            "deleted": self.deleted
        }

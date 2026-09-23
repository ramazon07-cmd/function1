from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    """Small extension for profile-only data without replacing Django's User model.

    The avatar is stored as a small base64 payload in PostgreSQL/SQLite so profile
    photos survive stateless Render deploys without requiring a media disk.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile_details',
    )
    profile_image_data = models.TextField(blank=True)
    profile_image_mime = models.CharField(max_length=40, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Profile: {self.user_id}'

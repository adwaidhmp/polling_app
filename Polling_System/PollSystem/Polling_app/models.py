from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone
from django.conf import settings


class UserManager(BaseUserManager):
    def create_user(self, email, full_name, password=None):
        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            full_name=full_name
        )

        user.set_password(password)  
        user.save()
        return user

    def create_superuser(self, email, full_name, password=None):
        user = self.create_user(email, full_name, password)
        user.is_staff = True
        user.is_superuser = True
        user.save()
        return user


class User(AbstractBaseUser, PermissionsMixin):
    full_name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["full_name"]

    def __str__(self):
        return self.email
    

class Poll(models.Model):
    question = models.CharField(max_length=255)

    expiry_date = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def is_active(self):
        """
        Poll is active if expiry_date is not passed
        """
        if self.expiry_date:
            return timezone.now() < self.expiry_date
        return True  

    def __str__(self):
        return self.question
    

class Option(models.Model):
    poll = models.ForeignKey(
        Poll,
        related_name="options",
        on_delete=models.CASCADE
    )
    text = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.poll.question} - {self.text}"
    

class Vote(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    poll = models.ForeignKey(
        Poll,
        on_delete=models.CASCADE
    )

    option = models.ForeignKey(
        Option,
        on_delete=models.CASCADE
    )

    voted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "poll") 

    def __str__(self):
        return f"{self.user.email} voted for {self.option.text}"
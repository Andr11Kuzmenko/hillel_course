"""
This module defines Django models for managing contacts and services in an application.
"""

from django.db import models  # type: ignore


class Contacts(models.Model):
    """
    Model to store contact information for individuals.
    """

    name = models.CharField(max_length=255)
    email = models.EmailField()
    title = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)


class Services(models.Model):
    """
    Model to represent a service provided by a business, including pricing and timestamps.
    """

    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

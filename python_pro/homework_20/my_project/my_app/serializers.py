from rest_framework import serializers
from datetime import date


class TaskSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=100, required=True)
    description = serializers.CharField(required=False)
    due_date = serializers.DateField(required=True)

    def validate_due_date(self, value):
        if value < date.today():
            raise serializers.ValidationError("The due date cannot be in the past.")
        return value

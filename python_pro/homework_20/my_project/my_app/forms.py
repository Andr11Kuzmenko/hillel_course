from django import forms
from datetime import date


class TaskForm(forms.Form):
    title = forms.CharField(max_length=100, required=True)
    description = forms.CharField(widget=forms.Textarea, required=False)
    due_date = forms.DateField(required=True)

    def clean_due_date(self):
        due_date = self.cleaned_data.get("due_date")

        if due_date < date.today():
            raise forms.ValidationError("The due date cannot be in the past.")

        return due_date

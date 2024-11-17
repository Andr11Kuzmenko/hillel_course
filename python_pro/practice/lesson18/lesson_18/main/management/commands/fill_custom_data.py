from django.core.management.base import BaseCommand
from faker import Faker

from main.models import Book, Author


class Command(BaseCommand):
    help = 'Fills custom data in database'

    def add_arguments(self, parser):
        parser.add_argument('--count', type=int, help='Number of authors to create', default=10)

    def handle(self, *args, **kwargs):
        Author.objects.all().delete()
        count = kwargs["count"]
        faker = Faker()
        self.stdout.write(self.style.SUCCESS(f'Filling custom data for {count} authors'))
        for _ in range(count):
            Author.objects.create(first_name=faker.first_name(), last_name=faker.last_name())
        self.stdout.write(self.style.SUCCESS(f'Successfully created {count} authors'))


from django.core.management.base import BaseCommand
from django.conf import settings


class Command(BaseCommand):
    help = 'Bootstrap the admin user from environment variables (idempotent)'

    def handle(self, *args, **options):
        from users.models import CustomUser

        email = settings.ADMIN_EMAIL
        password = settings.ADMIN_PASSWORD

        if not email or not password:
            self.stderr.write('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env')
            return

        if CustomUser.objects.filter(role='admin').exists():
            self.stdout.write(self.style.WARNING('Admin user already exists. Skipping.'))
            return

        user = CustomUser.objects.create_user(
            email=email,
            name='System Admin',
            password=password,
            role='admin',
        )
        user.is_staff = True
        user.is_superuser = True
        user.save()

        self.stdout.write(self.style.SUCCESS(f'Admin created: {email}'))

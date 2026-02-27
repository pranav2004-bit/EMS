import requests
from django.conf import settings


class SupabaseStorage:
    """Utility class for Supabase Storage operations using service key."""

    BASE_URL = None
    BUCKET = None
    SERVICE_KEY = None

    @classmethod
    def _init(cls):
        cls.BASE_URL = settings.SUPABASE_URL
        cls.BUCKET = settings.SUPABASE_BUCKET_NAME
        cls.SERVICE_KEY = settings.SUPABASE_SERVICE_KEY

    @classmethod
    def _headers(cls):
        cls._init()
        return {
            'Authorization': f'Bearer {cls.SERVICE_KEY}',
            'apikey': cls.SERVICE_KEY,
        }

    @classmethod
    def upload_file(cls, file_obj, storage_path: str, content_type: str) -> dict:
        """Upload file to the private Supabase bucket. Returns storage path."""
        cls._init()
        url = f'{cls.BASE_URL}/storage/v1/object/{cls.BUCKET}/{storage_path}'
        headers = cls._headers()
        headers['Content-Type'] = content_type

        response = requests.post(url, headers=headers, data=file_obj.read())
        if response.status_code not in (200, 201):
            raise Exception(f'Upload failed: {response.text}')

        return {'storage_path': storage_path}

    @classmethod
    def generate_signed_url(cls, storage_path: str, expires_in: int = 3600) -> str:
        """Generate a time-limited signed URL for a file in the private bucket."""
        cls._init()
        url = (
            f'{cls.BASE_URL}/storage/v1/object/sign/{cls.BUCKET}/{storage_path}'
        )
        response = requests.post(
            url,
            headers=cls._headers(),
            json={'expiresIn': expires_in},
        )
        if response.status_code != 200:
            raise Exception(f'Signed URL generation failed: {response.text}')

        signed_url = response.json().get('signedURL')
        # Return full URL
        return f'{cls.BASE_URL}/storage/v1{signed_url}'

    @classmethod
    def delete_file(cls, storage_path: str) -> None:
        """Delete a file from the private bucket."""
        cls._init()
        url = f'{cls.BASE_URL}/storage/v1/object/{cls.BUCKET}/{storage_path}'
        response = requests.delete(url, headers=cls._headers())
        if response.status_code not in (200, 204):
            raise Exception(f'Delete failed: {response.text}')

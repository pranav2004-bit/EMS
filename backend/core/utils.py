from django.conf import settings


VALID_STATUS_TRANSITIONS = {
    'Open': ['Under Review'],
    'Under Review': ['Resolved'],
    'Resolved': [],
}


def classify_severity(urgency_level: str, impact_flags: list) -> str:
    """Rule-based severity classifier."""
    high_impact = {'harassment', 'discrimination', 'fraud', 'safety'}
    has_high_impact = bool(set(f.lower() for f in impact_flags) & high_impact)

    if urgency_level == 'Critical' or (urgency_level == 'High' and has_high_impact):
        return 'Critical'
    elif urgency_level == 'High' or has_high_impact:
        return 'High'
    elif urgency_level == 'Medium':
        return 'Medium'
    return 'Low'


def is_valid_transition(current_status: str, new_status: str) -> bool:
    """Check if a status transition is valid."""
    if current_status == new_status:
        return True
    allowed = VALID_STATUS_TRANSITIONS.get(current_status, [])
    return new_status in allowed


def validate_file(file_obj) -> tuple[bool, str]:
    """Validate file type and size against allowed list using file signatures."""
    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    if file_obj.size > max_bytes:
        return False, f'File exceeds maximum size of {settings.MAX_UPLOAD_SIZE_MB}MB.'

    header = file_obj.read(8)
    file_obj.seek(0)

    mime = _detect_mime(header, file_obj.name)
    if mime not in settings.ALLOWED_FILE_TYPES:
        return False, f'File type "{mime}" is not permitted.'

    return True, ''


def _detect_mime(header: bytes, filename: str) -> str:
    """Detect MIME type from file header bytes."""
    # PDF
    if header.startswith(b'%PDF'):
        return 'application/pdf'
    # PNG
    if header.startswith(b'\x89PNG\r\n\x1a\n'):
        return 'image/png'
    # JPEG
    if header.startswith(b'\xff\xd8\xff'):
        return 'image/jpeg'
    # DOCX (ZIP-based)
    if header.startswith(b'PK\x03\x04'):
        return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    # Fallback to extension
    import mimetypes
    mime, _ = mimetypes.guess_type(filename)
    return mime or 'application/octet-stream'

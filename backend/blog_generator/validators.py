from django.core.exceptions import ValidationError
from django.core.validators import EmailValidator
import re

def validate_personal_name(value):
    if len(value) < 2 or len(value) > 15:
        raise ValidationError('First name must be between 1 and 15 characters.')

    if not re.match("^[a-zA-Z0-9]*$", value):
        raise ValidationError('Username can only contain letters and numbers.')

    forbidden_first_names = ['admin', 'root', 'superuser']
    if value.lower() in forbidden_usernames:
        raise ValidationError(f'{value} is not an allowed username.')

def validate_user_password(value):
    if len(value) < 5 or len(value) > 20:
        raise ValidationError('Password must be between 5 and 20 characters.')
    if not re.search(r'[a-z]', value):
        raise ValidationError('Password must contain at least one lowercase letter.')
    if not re.search(r'[A-Z]', value):
        raise ValidationError('Password must contain at least one uppercase letter.')
    if not re.search(r'\d', value):
        raise ValidationError('Password must contain at least one number.')

def validate_username(value):
    if len(value) < 4 or len(value) > 30:
        raise ValidationError('Username must be between 4 and 30 characters.')

    if not re.match("^[a-zA-Z0-9]+$", value):
        raise ValidationError('Username can only contain letters and numbers.')

    forbidden_usernames = ['admin', 'root', 'superuser']
    if value.lower() in forbidden_usernames:
        raise ValidationError(f'{value} is not an allowed username.')

def validate_email_domain(value):
    email_validator = EmailValidator()
    try:
        email_validator(value)
    except ValidationError:
        raise ValidationError(f'{value} is not a valid email address.')
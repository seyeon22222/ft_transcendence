from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.utils import timezone
import re

# 참조: https://gist.github.com/LowerDeez/cb6a62ebf33764468f15f465276b89d6

def get_online_users():
    MyUser = get_user_model()
    active_sessions = Session.objects.filter(expire_date__gte=timezone.now())
    user_id_list = []
    for session in active_sessions:
        data = session.get_decoded()
        user_id_list.append(data.get('_auth_user_id', None))
    # 사용자 ID 목록을 기반으로 사용자를 쿼리합니다.
    return MyUser.objects.filter(user_id__in=user_id_list)


# vaildate input
def validate_input(input):
    prohibited_words = ['admin', 'test', 'qwerty', '123']
    for word in prohibited_words:
        if word in input.lower():
            return False, f"Input must not contain prohibited word: {word}"

    if not re.match(r'^[a-zA-Z0-9_.-]+$', input):
        return False, "Input contains invalid characters"
    
    return True, "Success"

# validate password
def validate_password(username, password):
    if len(password) < 8 or len(password) > 20:
        return False, "Password must be 8~20 characters long"

    if not re.search(r'[a-z]', password) or not re.search(r'[A-Z]', password):
        return False, "Password must contain at least one uppercase and one lowercase letter"
    
    if not re.search(r'[0-9]', password) or not re.search(r'[~!@#$%^&*]', password):
        return False, "Password must contain at least one digit and one special character"

    prohibited_words = ['admin', 'test', 'password', 'qwerty', '123']
    for word in prohibited_words:
        if word in password.lower():
            return False, f"Password must not contain prohibited word: {word}"
    
    if username.lower() in password.lower():
        return False, "Password must not contain username"
    
    return True, "Success"
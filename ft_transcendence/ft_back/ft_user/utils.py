from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.utils import timezone
import re

def get_online_users():
    MyUser = get_user_model()
    active_sessions = Session.objects.filter(expire_date__gte=timezone.now())
    user_id_list = []
    for session in active_sessions:
        data = session.get_decoded()
        user_id_list.append(data.get('_auth_user_id', None))
    return MyUser.objects.filter(user_id__in=user_id_list)

def validate_input(input):
    prohibited_words = ['admin']
    for word in prohibited_words:
        if word in input.lower():
            return False, f"다음 단어는 사용이 금지되었습니다 : {word}"

    if not re.match(r'^[a-zA-Z0-9_.-~!@#$%^&*]+$', input):
        return False, "사용이 금지된 특수문자가 포함되어 있습니다"
    
    return True, "Success"

def validate_password(username, password):
    if len(password) < 8 or len(password) > 20:
        return False, "비밀번호는 8자 이상 20자 이하여야 합니다"

    if not re.search(r'[a-z]', password) or not re.search(r'[A-Z]', password):
        return False, "비밀번호는 알파벳 대문자와 소문자가 모두 포함되어야 합니다"
    
    if not re.search(r'[0-9]', password) or not re.search(r'[_.-~!@#$%^&*]', password):
        return False, "비밀번호는 숫자와 특수문자가 모두 포함되어야 합니다"

    prohibited_words = ['admin']
    for word in prohibited_words:
        if word in password.lower():
            return False, f"다음 단어는 사용이 금지되었습니다 : {word}"
    
    if username.lower() in password.lower():
        return False, "비밀번호에 아이디를 사용할 수 없습니다"
    
    return True, "Success"

def validate_email(email):
    if not re.match(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$', email):
        return False, "부적절한 이메일 형식입니다"
    
    return True, "Success"
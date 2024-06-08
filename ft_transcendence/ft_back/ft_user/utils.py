from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.utils import timezone

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
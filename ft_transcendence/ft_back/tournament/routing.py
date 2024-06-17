from django.urls import re_path
from . import consumers

websocket_urlpatterns2 = [
    re_path(r'ws/tournament/(?P<tournament_id>\w+)/$', consumers.MatchConsumer.as_asgi()),
    re_path(r'ws/message/(?P<user_id>[^/]+)/$', consumers.messageConsumer.as_asgi()),
]

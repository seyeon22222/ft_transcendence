from django.urls import re_path
from .consumer import MatchConsumer,messageConsumer

websocket_urlpatterns2 = [
    re_path(r'ws/tournament/(?P<tournament_id>\w+)/$', MatchConsumer.MatchConsumer.as_asgi()),
    re_path(r'ws/message/(?P<user_id>[^/]+)/$', messageConsumer.messageConsumer.as_asgi()),
]

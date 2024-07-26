
from django.urls import re_path

from .consumer import ChatConsumer,PrivateChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', ChatConsumer.ChatConsumer.as_asgi()),
    re_path(r'ws/privatechat/(?P<room_name>\w+)/$', PrivateChatConsumer.PrivateChatConsumer.as_asgi()),
] 
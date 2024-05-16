
from django.urls import path, re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatConsumer.as_asgi()),
] 

# websocket_urlpatterns = [
#     path('ws/chat/<str:room_name>/', consumers.ChatConsumer.as_asgi()),
#     path('ws/#chat/<str:room_name>/', consumers.ChatConsumer.as_asgi()),
# ] 
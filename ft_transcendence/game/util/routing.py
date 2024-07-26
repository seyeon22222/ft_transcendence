
from django.urls import re_path

from .consumer import MatchConsumer
from .consumer import TMatchConsumer
from .consumer import MultiMatchConsumer

websocket_urlpatterns = [
     re_path(r'ws/tgame/(?P<slug_name>[\w-]+)/$', TMatchConsumer.TMatchConsumer.as_asgi()),
     re_path(r'ws/multigame/(?P<slug_name>[\w-]+)/$', MultiMatchConsumer.MultiMatchConsumer.as_asgi()),
     re_path(r'ws/game/(?P<slug_name>[\w-]+)/$', MatchConsumer.MatchConsumer.as_asgi()),
]
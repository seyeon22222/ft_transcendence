
from django.urls import re_path

from . import consumers
from . import customConsumers

websocket_urlpatterns = [
     re_path(r'ws/tgame/(?P<slug_name>[\w-]+)/$', consumers.TGameConsumer.as_asgi()),
     re_path(r'ws/multigame/(?P<slug_name>[\w-]+)/$', consumers.MultiGameConsumer.as_asgi()),
     re_path(r'ws/game/(?P<slug_name>[\w-]+)/$', consumers.GameConsumer.as_asgi()),
     re_path(r'ws/custom/(?P<slug_name>[\w-]+)/$', customConsumers.CustomConsumer.as_asgi()),
     re_path(r'ws/multicustom/(?P<slug_name>[\w-]+)/$', customConsumers.MultiCustomConsumer.as_asgi()),
     re_path(r'ws/tcustom/(?P<slug_name>[\w-]+)/$', customConsumers.TCustomConsumer.as_asgi()),
]
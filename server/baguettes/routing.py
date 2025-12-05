from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/shell/$', consumers.ShellConsumer.as_asgi()),
]

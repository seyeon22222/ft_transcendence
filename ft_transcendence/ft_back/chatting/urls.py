from django.urls import path
from .views import (
    RoomListView, RoomDetailView, PrivateRoomListView, 
    PrivateRoomDetailView, PrivateRoomUserListView
)

app_name = "chatting"

urlpatterns = [
    path('rooms/', RoomListView.as_view(), name='room_list'),
    path('rooms/<slug:slug>/', RoomDetailView.as_view(), name='room_detail'),
    path('privaterooms/check/', PrivateRoomDetailView.as_view(), name="private_room_check"),
    path('privaterooms/getusers/<slug:slug>/', PrivateRoomUserListView.as_view(), name='private_room_user_list'),
    path('privaterooms/<str:sender>/<str:receiver>/', PrivateRoomListView.as_view(), name="private_room_list_usernames"),
    path('privaterooms/<slug:slug>/', PrivateRoomDetailView.as_view(), name="private_room_detail"),
]
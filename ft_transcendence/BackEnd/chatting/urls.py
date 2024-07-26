from django.urls import path
from .view import (
    RoomListView, RoomDetailView, PrivateRoomListView, 
    PrivateRoomDetailView, PrivateRoomUserListView
)

app_name = "chatting"

urlpatterns = [
    path('rooms/', RoomListView.RoomListView.as_view(), name='room_list'),
    path('rooms/<slug:slug>/', RoomDetailView.RoomDetailView.as_view(), name='room_detail'),
    path('privaterooms/check/', PrivateRoomDetailView.PrivateRoomDetailView.as_view(), name="private_room_check"),
    path('privaterooms/getusers/<slug:slug>/', PrivateRoomUserListView.PrivateRoomUserListView.as_view(), name='private_room_user_list'),
    path('privaterooms/<str:sender>/<str:receiver>/', PrivateRoomListView.PrivateRoomListView.as_view(), name="private_room_list_usernames"),
    path('privaterooms/<slug:slug>/', PrivateRoomDetailView.PrivateRoomDetailView.as_view(), name="private_room_detail"),
]
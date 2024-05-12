from django.urls import path
from .views import RoomListView, RoomDetailView

app_name = "chatting"

# urlpatterns = [
# 	path('Rooms/', views.rooms, name = 'rooms'),
#     path('room_make/', views.room_make, name='room_make'),
#     path('<slug:slug>/', views.room, name='room'),
# ]

urlpatterns = [
    path('rooms/', RoomListView.as_view(), name='room_list'),
    path('rooms/<slug:slug>/', RoomDetailView.as_view(), name='room_detail'),
]
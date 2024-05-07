from django.urls import path
from . import views

app_name = "chatting"

urlpatterns = [
	path('Rooms/', views.rooms, name = 'rooms'),
    path('room_make/', views.room_make, name='room_make'),
    path('<slug:slug>/', views.room, name='room'),
]


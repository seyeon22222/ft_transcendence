from django.utils.text import slugify
from .models import Room, Message
from ft_user.models import MyUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Room, Message, PrivateRoom, PrivateMessage
from .serializers import RoomSerializer, MessageSerializer, PrivateRoomSerializer, PrivateMessageSerializer
from rest_framework.permissions import IsAuthenticated

import hashlib
from datetime import datetime

class RoomListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        rooms = Room.objects.all()
        if rooms.count() != 0:
            serializer = RoomSerializer(rooms, many=True)
            return Response(serializer.data)
        else:
            return Response(status=301)

    def post(self, request):
        room_name = request.data.get('room_name')
        if room_name:
            room_slug = slugify(room_name)
            if Room.objects.filter(slug=room_slug).exists():
                return Response({'error': '중복된 방이 있습니다.'}, status=status.HTTP_400_BAD_REQUEST)
            room = Room.objects.create(name=room_name, slug=room_slug)
            serializer = RoomSerializer(room)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'error': '방 이름을 제공해주세요.'}, status=status.HTTP_400_BAD_REQUEST)

class RoomDetailView(APIView):
    def get(self, request, slug):
        try:
            room = Room.objects.get(slug=slug)
        except Room.DoesNotExist:
            return Response({'error': '방을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        messages = Message.objects.filter(room=room)
        room_serializer = RoomSerializer(room)
        message_serializer = MessageSerializer(messages, many=True)
        return Response({'room': room_serializer.data, 'messages': message_serializer.data})

    
class PrivateRoomListView(APIView):
    permission_classes = [IsAuthenticated]

    # if given two users already has chatting room, return 200. else, return 404
    def get(self, request, sender, receiver):
        user1 = MyUser.objects.get(username=sender)
        user2 = MyUser.objects.get(username=receiver)

        if PrivateRoom.objects.filter(user1 = user1, user2 = user2).exists():
            private_room = PrivateRoom.objects.get(user1=user1, user2=user2)
            serializer = PrivateRoomSerializer(private_room)
            return Response(serializer.data, status=200)    
        elif PrivateRoom.objects.filter(user1 = user2, user2 = user1).exists():
            private_room = PrivateRoom.objects.get(user1=user2, user2=user1)
            serializer = PrivateRoomSerializer(private_room)
            return Response(serializer.data, status=200)
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)    

    # create chatting room with given two users. check duplicate by GET first
    def post(self, request, sender, receiver):
        user1 = MyUser.objects.get(username=sender)
        user2 = MyUser.objects.get(username=receiver)

        timestamp = datetime.now().strftime('%Y%m%d%H%M%S%f')
        combined_string = f"{user1.user_id}_{user2.user_id}_{timestamp}"
        slug = hashlib.sha256(combined_string.encode()).hexdigest()[:10]  # Use the first 10 characters of the hash

        private_room = PrivateRoom.objects.create(user1=user1, user2=user2, slug=slug)
        serializer = PrivateRoomSerializer(private_room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

        
class PrivateRoomDetailView(APIView):
    # get detailed private room info by slug
    def get(self, request, slug):
        try:
            private_room = PrivateRoom.objects.get(slug=slug)
        except PrivateRoom.DoesNotExist:
            return Response({'error': '그런 1:1 채팅방을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        
        messages = PrivateMessage.objects.filter(room=private_room)
        private_room_serializer = PrivateRoomSerializer(private_room)
        message_serializer = PrivateMessageSerializer(messages, many=True)
        return Response({'room': private_room_serializer.data, 'messages': message_serializer.data})

    # is slug available with given user
    def post(self, request):
        print(request)
        print(request.data)
        username = request.data.get('username')
        slug = request.data.get('slug')

        private_room = PrivateRoom.objects.get(slug=slug)
        if private_room.user1.username == username:
            return Response(status=200)
        elif private_room.user2.username == username:
            return Response(status=200)
        else:
            return Response(status=HTTP_400_BAD_REQUEST)
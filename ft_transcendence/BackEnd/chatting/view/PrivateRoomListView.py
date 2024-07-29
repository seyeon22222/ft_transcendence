from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from User.model.MyUser import MyUser
from ..model import PrivateRoom
from ..serializer import PrivateRoomSerializer

import hashlib
from datetime import datetime

class PrivateRoomListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, sender, receiver):
        user1 = MyUser.objects.get(username=sender)
        user2 = MyUser.objects.get(username=receiver)

        if PrivateRoom.PrivateRoom.objects.filter(user1 = user1, user2 = user2).exists():
            private_room = PrivateRoom.PrivateRoom.objects.get(user1=user1, user2=user2)
            serializer = PrivateRoomSerializer.PrivateRoomSerializer(private_room)
            return Response(serializer.data, status=200)    
        elif PrivateRoom.PrivateRoom.objects.filter(user1 = user2, user2 = user1).exists():
            private_room = PrivateRoom.PrivateRoom.objects.get(user1=user2, user2=user1)
            serializer = PrivateRoomSerializer.PrivateRoomSerializer(private_room)
            return Response(serializer.data, status=200)
        else:
            return Response(status=301)    

    def post(self, request, sender, receiver):
        user1 = MyUser.objects.get(username=sender)
        user2 = MyUser.objects.get(username=receiver)

        timestamp = datetime.now().strftime('%Y%m%d%H%M%S%f')
        combined_string = f"{user1.user_id}_{user2.user_id}_{timestamp}"
        slug = hashlib.sha256(combined_string.encode()).hexdigest()[:10]

        private_room = PrivateRoom.PrivateRoom.objects.create(user1=user1, user2=user2, slug=slug)
        serializer = PrivateRoomSerializer.PrivateRoomSerializer(private_room)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
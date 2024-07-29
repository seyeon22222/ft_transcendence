from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import PrivateRoom, PrivateMessage
from ..serializer import PrivateRoomSerializer, PrivateMessageSerializer

class PrivateRoomDetailView(APIView):
    def get(self, request, slug):
        try:
            private_room = PrivateRoom.PrivateRoom.objects.get(slug=slug)
        except PrivateRoom.PrivateRoom.DoesNotExist:
            return Response({'error': '그런 1:1 채팅방을 찾을 수 없습니다.'}, status=301)
        
        messages = PrivateMessage.PrivateMessage.objects.filter(room=private_room)
        private_room_serializer = PrivateRoomSerializer.PrivateRoomSerializer(private_room)
        message_serializer = PrivateMessageSerializer.PrivateMessageSerializer(messages, many=True)
        return Response({'room': private_room_serializer.data, 'messages': message_serializer.data})

    def post(self, request):
        username = request.data.get('username')
        slug = request.data.get('slug')

        private_room = PrivateRoom.PrivateRoom.objects.get(slug=slug)
        if private_room.user1.username == username:
            return Response(status=200)
        elif private_room.user2.username == username:
            return Response(status=200)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
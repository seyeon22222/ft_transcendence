from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import Room, Message
from ..serializer import RoomSerializer, MessageSerializer

class RoomDetailView(APIView):
    def get(self, request, slug):
        try:
            room = Room.Room.objects.get(slug=slug)
        except Room.Room.DoesNotExist:
            return Response({'error': '방을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        messages = Message.Message.objects.filter(room=room)
        room_serializer = RoomSerializer.RoomSerializer(room)
        message_serializer = MessageSerializer.MessageSerializer(messages, many=True)
        return Response({'room': room_serializer.data, 'messages': message_serializer.data})
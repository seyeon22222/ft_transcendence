from django.utils.text import slugify
from .models import Room, Message
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Room, Message
from .serializers import RoomSerializer, MessageSerializer
from rest_framework.permissions import IsAuthenticated

class RoomListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        print("get method")
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
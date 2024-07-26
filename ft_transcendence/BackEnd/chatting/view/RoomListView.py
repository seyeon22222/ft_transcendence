from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils.text import slugify
from ..model import Room
from ..serializer import RoomSerializer
from User.utils import validate_input

class RoomListView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        rooms = Room.Room.objects.all()
        if rooms.count() != 0:
            serializer = RoomSerializer.RoomSerializer(rooms, many=True)
            return Response(serializer.data)
        else:
            return Response(status=301)

    def post(self, request):
        room_name = request.data.get('room_name')

        valid, message = validate_input(room_name)
        if not valid:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

        if room_name:
            room_slug = slugify(room_name)
            if Room.Room.objects.filter(slug=room_slug).exists():
                return Response({'error': '중복된 방이 있습니다.'}, status=status.HTTP_400_BAD_REQUEST)
            room = Room.Room.objects.create(name=room_name, slug=room_slug)
            serializer = RoomSerializer.RoomSerializer(room)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'error': '방 이름을 제공해주세요.'}, status=status.HTTP_400_BAD_REQUEST)
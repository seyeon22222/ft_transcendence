# from django.contrib.auth.decorators import login_required
# from django.shortcuts import render, redirect
# from django.utils.text import slugify
# from .models import Room, Message

# @login_required
# def rooms(request):
#     rooms = Room.objects.all()
#     if rooms:
#         return render(request, 'rooms.html', {'rooms': rooms})
#     else:
#         return render(request, 'rooms.html')

# @login_required
# def room_make(request):
#     if request.method == "POST":
#         room_name = request.POST["room_name"]
#         room_slug = slugify(room_name)
#         if Room.objects.filter(slug=room_slug).exists():
#             # 중복 처리 로직 추가
#             print("중복 된 방이 있습니다")
#             return redirect('chatting:rooms')
#         else:
#             _room = Room.objects.create(name=room_name, slug=room_slug)
#             _room.save()
#             print("방 생성")
#     else:
#         print("방 생성 실패")
#     return redirect('chatting:rooms')
    
# @login_required
# def room(request, slug):
#     room = None
#     try:
#         room = Room.objects.get(slug=slug)
#     except Room.DoesNotExist:
#         pass
#     messages = Message.objects.filter(room=room)
#     if room:
#         return render(request, 'room.html', {'room': room, 'messages': messages})
#     else:
#         return redirect('chatting:Rooms')


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
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data)

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
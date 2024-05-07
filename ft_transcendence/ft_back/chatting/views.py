from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.utils.text import slugify
from .models import Room, Message

@login_required
def rooms(request):
    rooms = Room.objects.all()
    if rooms:
        return render(request, 'rooms.html', {'rooms': rooms})
    else:
        return render(request, 'rooms.html')

@login_required
def room_make(request):
    if request.method == "POST":
        room_name = request.POST["room_name"]
        room_slug = slugify(room_name)
        if Room.objects.filter(slug=room_slug).exists():
            # 중복 처리 로직 추가
            print("중복 된 방이 있습니다")
            return redirect('chatting:rooms')
        else:
            _room = Room.objects.create(name=room_name, slug=room_slug)
            _room.save()
            print("방 생성")
    else:
        print("방 생성 실패")
    return redirect('chatting:rooms')
    
@login_required
def room(request, slug):
    room = None
    try:
        room = Room.objects.get(slug=slug)
    except Room.DoesNotExist:
        pass
    messages = Message.objects.filter(room=room)
    if room:
        return render(request, 'room.html', {'room': room, 'messages': messages})
    else:
        return redirect('chatting:Rooms')
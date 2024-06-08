import json
from ft_user.models import MyUser
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async

from .models import Room, Message, PrivateRoom, PrivateMessage

class ChatConsumer(AsyncWebsocketConsumer):

    # debug
    print("chatConsumer called") 
    
    # 동기식 연결
    async def connect(self): 
        # debug
        print("chatConsumer connect") 
        
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code = None):

        # debug
        print("chatConsumer disconnect") 

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):

        # debug
        print("chatConsumer receive") 

        data = json.loads(text_data)
        message = data["message"]
        username = data["username"]
        room = data["room"]

        await self.save_message(username, room, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": username
            }
        )

    # Receive message from room group
    async def chat_message(self, event):

        # debug
        print("chatConsumer chat message") 

        message = event["message"]
        username = event["username"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "message": message,
            "username": username
        }))

    @sync_to_async
    def save_message(self, username, room, message):

        # debug
        print("chatConsumer save message") 

        user = MyUser.objects.get(username=username)
        room = Room.objects.get(slug=room)

        Message.objects.create(user=user, room=room, content=message)

class PrivateChatConsumer(AsyncWebsocketConsumer):

    # debug
    print("PrivateChatConsumer called") 
    
    # 동기식 연결
    async def connect(self): 
        # debug
        print("PrivatechatConsumer connect") 
        
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code = None):

        # debug
        print("PrivateChatConsumer disconnect") 

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):

        # debug
        print("PrivateChatConsumer receive") 

        data = json.loads(text_data)
        message = data["message"]
        username = data["username"]
        room = data["room"]

        await self.save_message(username, room, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "username": username
            }
        )

    # Receive message from room group
    async def chat_message(self, event):

        # debug
        print("PrivateChatConsumer chat message") 

        message = event["message"]
        username = event["username"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            "message": message,
            "username": username
        }))

    @sync_to_async
    def save_message(self, username, room, message):

        # debug
        print("PrivateChatConsumer save message") 

        user = MyUser.objects.get(username=username)
        room = PrivateRoom.objects.get(slug=room)

        print(user)
        print(room)

        PrivateMessage.objects.create(user=user, room=room, content=message)
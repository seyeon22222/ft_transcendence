import json
import asyncio
import requests
from channels.generic.websocket import AsyncWebsocketConsumer
from . import customInfo

class CustomConsumer(AsyncWebsocketConsumer):
    consumers = {}  # 클래스 변수, Consumer 인스턴스를 저장할 딕셔너리

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.info = customInfo.CustomInfo()
        
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
    
        await self.accept()

        if self.room_group_name in self.consumers:
            self.consumer = self.consumers[self.room_group_name]
            self.info = self.consumers[self.room_group_name].info
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self

        self.info.player_count += 1

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        self.info.player_count -= 1
        if self.info.player_count == 0:
            del self.consumers[self.room_group_name]
        print("=======================================self.players : =====================")
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        reply = ''

        print("message :", message)
        if message == 1:
            reply = 'complete'
        if message == 2:
            reply = 'start'
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type' : 'send_message',
                'message' : reply
            }
        )
    
    async def send_message(self, event):

        message = event["message"]

        await self.send(text_data=json.dumps({
            "message": message,
        }))
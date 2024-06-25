import json
import asyncio
import requests
from channels.generic.websocket import AsyncWebsocketConsumer
from . import customInfo

class GameConsumer(AsyncWebsocketConsumer):
    consumers = {}  # 클래스 변수, Consumer 인스턴스를 저장할 딕셔너리

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.info = customInfo.CustomInfo()
        
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name}'
    
        await self.accept()

        if self.room_group_name in self.consumers:
            self.consumer = self.consumers[self.room_group_name]
            self.info = self.consumers[self.room_group_name]
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self

        self.info.player_count += 1

        await self.send(text_data=json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active':self.b.is_active
            }))

    async def disconnect(self, close_code):
        self.task.cancel()
        self.info.player_count -= 1
        if self.info.player_count == 0:
            del self.consumers[self.room_group_name]
        print("=======================================self.players : " + str(self.players) + " self.is_active : " + str(self.b.is_active) + "=====================")
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        player = text_data_json['players']

        await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active':self.b.is_active
            }))
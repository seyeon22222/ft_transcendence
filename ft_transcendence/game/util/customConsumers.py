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
        self.player = None
        self.reply = ''
        
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name}'
        self.loop = asyncio.get_event_loop()

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
    
        await self.accept()

        if self.room_group_name in self.consumers:
            self.consumer = self.consumers[self.room_group_name]
            self.info = self.consumers[self.room_group_name].info
            self.reply = self.consumers[self.room_group_name].reply
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.task = self.loop.create_task(self.update_time())

        self.info.player_count += 1

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        self.info.player_count -= 1
        if self.info.player_count == 0:
            del self.consumers[self.room_group_name]
        if self.info.time != -1 :
            self.info.time = 0
            
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        if self.player is None:
            self.player = message
        elif message == 1:
            self.reply = 'complete'
        elif message == 2 and self.reply == 'complete':
            self.reply = 'start'
            self.info.time = -1
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type' : 'send_message',
                'message' : self.reply
            }
        )
    
    async def send_message(self, event):

        message = event["message"]

        await self.send(text_data=json.dumps({
            "message": message,
        }))
    
    async def send_time(self, event):

        time = event["time"]

        await self.send(text_data=json.dumps({
            "time": time,
        }))

    async def update_time(self):
        while self.info.time >= 0:
            # 클라이언트로 메시지 보내기
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type' : 'send_time',
                    'time' : self.info.time
                }
            )
            self.info.time -= 1
            await asyncio.sleep(1)

class TCustomConsumer(AsyncWebsocketConsumer):
    consumers = {}  # 클래스 변수, Consumer 인스턴스를 저장할 딕셔너리

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.info = customInfo.CustomInfo()
        self.player = None
        
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name}'
        self.loop = asyncio.get_event_loop()

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
            self.task = self.loop.create_task(self.update_time())

        self.info.player_count += 1

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        self.info.player_count -= 1
        if self.info.player_count == 0:
            del self.consumers[self.room_group_name]
        if self.info.time != -1 :
            self.info.time = 0
            
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        reply = ''

        if self.player is None:
            self.player = message
        elif message == 1:
            reply = 'complete'
        elif message == 2:
            reply = 'start'
            self.info.time = -1
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
    
    async def send_time(self, event):

        time = event["time"]

        await self.send(text_data=json.dumps({
            "time": time,
        }))

    async def update_time(self):
        while self.info.time >= 0:
            # 클라이언트로 메시지 보내기
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type' : 'send_time',
                    'time' : self.info.time
                }
            )
            self.info.time -= 1
            await asyncio.sleep(1)

class MultiCustomConsumer(AsyncWebsocketConsumer):
    consumers = {}  # 클래스 변수, Consumer 인스턴스를 저장할 딕셔너리

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.info = customInfo.CustomInfo()
        self.player = None
        self.ready = [False, False, False]
        
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name[:50]}'
        self.loop = asyncio.get_event_loop()

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
            self.task = self.loop.create_task(self.update_time())

        self.info.player_count += 1

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        self.info.player_count -= 1
        if self.info.player_count == 0:
            del self.consumers[self.room_group_name]
        if self.info.time != -1 :
            self.info.time = 0
            
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        reply = ''

        if self.player is None:
            self.player = message
        elif message == 1:
            reply = 'complete'
        elif message == 2 or message == 3 or message == 4:
            self.ready[message - 2] = True

        count = 0
        for i in range(0, 3):
            if self.ready[i] == True:
                count += 1
        if count == 3:
            reply = 'start'
            self.info.time = -1

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
    
    async def send_time(self, event):

        time = event["time"]

        await self.send(text_data=json.dumps({
            "time": time,
        }))

    async def update_time(self):
        while self.info.time >= 0:
            # 클라이언트로 메시지 보내기
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type' : 'send_time',
                    'time' : self.info.time
                }
            )
            self.info.time -= 1
            await asyncio.sleep(1)
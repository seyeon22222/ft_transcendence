import json
import asyncio
import requests
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from . import customInfo

class CustomConsumer(AsyncWebsocketConsumer):
    consumers = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.info = customInfo.CustomInfo()
        self.player = None
        self.ready = [False]
        
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
            self.ready = self.consumers[self.room_group_name].ready
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.task = self.loop.create_task(self.update_time())

        self.info.player_count += 1

    async def disconnect(self, close_code):
        self.info.stop = True
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        self.info.player_count -= 1
        if self.info.player_count == 0:
            del self.consumers[self.room_group_name]
            backend_url = 'http://backend:8000/match/matchview/' + list(self.room_name.split('_'))[-1]
            params= { 'is_start': True }
            response = requests.post(backend_url, json=params)
        if self.info.time > 0 :
            if self.player == 1:
                match_result = 2
            elif self.player == 2:
                match_result = 1
            backend_url = 'http://backend:8000/match/matchresult/' + list(self.room_name.split('_'))[-1]
            game_results = {
                'match_date': datetime.now().isoformat(),
                'match_result': match_result,
                'is_active': False,
            }
            response = requests.post(backend_url, json=game_results)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        reply = ''

        if self.player is None:
            self.player = message
        
        elif message == 1:
            reply = 'complete'
            self.ready[0]= True

        elif self.ready[0] == True and message == 2:
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
            if self.info.stop:
                self.info.time = 0
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
    consumers = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.info = customInfo.CustomInfo()
        self.player = None
        self.ready = [False]

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
            self.ready = self.consumers[self.room_group_name].ready
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.task = self.loop.create_task(self.update_time())

        self.info.player_count += 1

    async def disconnect(self, close_code):
        self.info.stop = True
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        self.info.player_count -= 1
        if self.info.player_count == 0:
            del self.consumers[self.room_group_name]
            backend_url = 'http://backend:8000/match/t_matchview/' + list(self.room_name.split('_'))[0] + list(self.room_name.split('_'))[1] + list(self.room_name.split('_'))[-1]
            params= { 'is_start': True }
            response = requests.post(backend_url, json=params)
        if self.info.time > 0 :
            if self.player == 1:
                match_result = 2
            elif self.player == 2:
                match_result = 1
            backend_url = 'http://backend:8000/match/tournamentresult/' + list(self.room_name.split('_'))[-1]
            game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': match_result,
                    'player1': list(self.room_name.split('_'))[0],
                    'player2': list(self.room_name.split('_'))[1]
            }
            response = requests.post(backend_url, json=game_results)
            
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        reply = ''

        if self.player is None:
            self.player = message
            
        elif message == 1:
            reply = 'complete'
            self.ready[0]= True

           
        elif self.ready[0] == True and message == 2:
            reply = 'start'
            self.info.time = -1


        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type' : 'send_message',
                'message' : reply
            }
        )
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
            if self.info.stop:
                self.info.time = 0
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
    consumers = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.info = customInfo.CustomInfo()
        self.player = None
        self.ready = [False, False, False, False]
        
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name[-50:]}'
        self.loop = asyncio.get_event_loop()

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
    
        await self.accept()

        if self.room_group_name in self.consumers:
            self.consumer = self.consumers[self.room_group_name]
            self.info = self.consumers[self.room_group_name].info
            self.ready = self.consumers[self.room_group_name].ready
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.task = self.loop.create_task(self.update_time())

        self.info.player_count += 1

    async def disconnect(self, close_code):
        self.info.stop = True
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        self.info.player_count -= 1
        if self.info.player_count == 0:
            del self.consumers[self.room_group_name]
            backend_url = 'http://backend:8000/match/multimatchview/' + list(self.room_name.split('_'))[-1]
            params= { 'is_start': True }
            response = requests.post(backend_url, json=params)
        if self.info.time > 0 :
            if self.player == 1 or self.player == 3:
                match_result = 2
            elif self.player == 2 or self.player == 4:
                match_result = 1
            backend_url = 'http://backend:8000/match/multimatchresult/' + list(self.room_name.split('_'))[-1]
            game_results = {
                'match_date': datetime.now().isoformat(),
                'match_result': match_result,
                'is_active': False,
            }
            response = requests.post(backend_url, json=game_results)
            
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        reply = ''

        if self.player is None:
            self.player = message
        elif message == 1:
            reply = 'complete'
            self.ready[0] = True
        elif self.ready[0] == True and (message == 2 or message == 3 or message == 4):
            self.ready[message - 1] = True

        count = 0
        for i in range(1, 4):
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
            if self.info.stop:
                self.info.time = 0
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type' : 'send_time',
                    'time' : self.info.time
                }
            )
            self.info.time -= 1
            await asyncio.sleep(1)
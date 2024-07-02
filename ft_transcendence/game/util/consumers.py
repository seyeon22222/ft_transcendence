import json
import asyncio
import time
import requests
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from . import ball

def setObject(data, obstacles):
    pos = [data['x'], data['y'], 0]
    degree = data['z']
    w = data['w']
    h = data['h']
    obj = ball.Box(w, h)
    if (degree):
        obj.rotBox(degree)
    obj.movePos(pos)
    obstacles.append(obj)

class GameConsumer(AsyncWebsocketConsumer):
    consumers = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dt = 0
        self.lastTime = 0
        self.players = None
        self.b = ball.Ball(0.5)
        self.p1 = ball.Stick([-15,1.5,0], 0.5, 3)
        self.p2 = ball.Stick([15,1.5,0], 0.5, 3)
        self.paddles = []
        self.obstacles = []
        self.message_loop = True
        self.game_loop = True

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name}'
        self.loop = asyncio.get_event_loop()
    
        await self.accept()

        if self.room_group_name in self.consumers:
            self.consumer = self.consumers[self.room_group_name]
            self.b = self.consumers[self.room_group_name].b
            self.p1 = self.consumers[self.room_group_name].p1
            self.p2 = self.consumers[self.room_group_name].p2
            self.paddles = self.consumers[self.room_group_name].paddles
            self.obstacles = self.consumers[self.room_group_name].obstacles
            self.task = self.loop.create_task(self.send_message())
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.paddles.append(self.p1)
            self.paddles.append(self.p2)
            self.obstacles.append(ball.Box(30, 0.5))
            self.obstacles[0].movePos([0, 8, 0])
            self.obstacles.append(ball.Box(30, 0.5))
            self.obstacles[1].movePos([0, -8, 0])
            backend_url = 'http://backend:8000/match/updatematchcustom/' + list(self.room_name.split('_'))[-1]
            params= { 'match_id': list(self.room_name.split('_'))[-1] }
            response = requests.get(backend_url, params=params)
            if response.status_code == 200:
                data = response.json()
                for d in data['customs']:
                    setObject(d, self.obstacles)
            self.task = self.loop.create_task(self.game_update())

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
        if self.players == 1:
            del self.consumers[self.room_group_name]
            match_result = 2
        elif self.players == 2:
            match_result = 1
        if self.b.is_active == 1:
            self.b.is_active = 0
            backend_url = 'http://backend:8000/match/matchresult/' + list(self.room_name.split('_'))[-1]
            game_results = {
                'match_date': datetime.now().isoformat(),
                'match_result': match_result,
                'is_active': False,
            }
            response = requests.post(backend_url, json=game_results)

    async def send_message(self):
        while self.message_loop:
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active':self.b.is_active
            }))
            if self.b.is_active == 0:
                self.message_loop = False
            await asyncio.sleep(0.001)

    async def game_update(self):
        while self.game_loop:
            self.dt = (time.perf_counter() - self.lastTime)
            self.lastTime = time.perf_counter()

            self.p1.update(self.p1.dir[1] * 10 * self.dt, self.obstacles[0].bot1[1], self.obstacles[1].top1[1])
            self.p2.update(self.p2.dir[1] * 10 * self.dt, self.obstacles[0].bot1[1], self.obstacles[1].top1[1])
            self.b.pos[2] = 1
            self.b.update(self.paddles, self.obstacles, self.dt * 20)
            self.b.pos[2] = 0
            if self.b.point1 == 5 :
                self.b.is_active = 0
                backend_url = 'http://backend:8000/match/matchresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 1,
                    'is_active': False,
                }
                response = requests.post(backend_url, json=game_results)

            elif self.b.point2 == 5:
                self.b.is_active = 0
                backend_url = 'http://backend:8000/match/matchresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 2,
                    'is_active': False,
                }
                response = requests.post(backend_url, json=game_results)
            if self.b.is_active == 0:
                self.game_loop = False
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active' :self.b.is_active
            }))
            await asyncio.sleep(0.001)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        player = text_data_json['players']

        if self.players == None:
            if (player == 1 or player == 2):
               self.players = player
        else:
            player = int(player)
        for i in range(0, 2):
            if (message == 'up' and player == i + 1):
                self.paddles[i].dir[1] = 1
            if (message == 'down' and player == i + 1):
                self.paddles[i].dir[1] = -1
            if (message == 'upstop' and self.paddles[i].dir[1] == 1 and player == i + 1):
                self.paddles[i].dir[1] = 0
            if (message == 'downstop' and self.paddles[i].dir[1] == -1 and player == i + 1):
                self.paddles[i].dir[1] = 0

class TGameConsumer(AsyncWebsocketConsumer):
    consumers = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dt = 0
        self.lastTime = 0
        self.players = None
        self.b = ball.Ball(0.5)
        self.p1 = ball.Stick([-15,1.5,0], 0.5, 3)
        self.p2 = ball.Stick([15,1.5,0], 0.5, 3)
        self.paddles = []
        self.obstacles = []
        self.message_loop = True
        self.game_loop = True

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name}'
        self.loop = asyncio.get_event_loop()
    
        await self.accept()

        if self.room_group_name in self.consumers:
            self.consumer = self.consumers[self.room_group_name]
            self.b = self.consumers[self.room_group_name].b
            self.p1 = self.consumers[self.room_group_name].p1
            self.p2 = self.consumers[self.room_group_name].p2
            self.paddles = self.consumers[self.room_group_name].paddles
            self.obstacles = self.consumers[self.room_group_name].obstacles
            self.task = self.loop.create_task(self.send_message())
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.paddles.append(self.p1)
            self.paddles.append(self.p2)
            self.obstacles.append(ball.Box(30, 0.5))
            self.obstacles[0].movePos([0, 8, 0])
            self.obstacles.append(ball.Box(30, 0.5))
            self.obstacles[1].movePos([0, -8, 0])
            backend_url = 'http://backend:8000/match/updatetournamentcustom/' + list(self.room_name.split('_'))[0] + list(self.room_name.split('_'))[1] + list(self.room_name.split('_'))[-1]
            params= { 'match_id': list(self.room_name.split('_'))[-1] }
            response = requests.get(backend_url, params=params)
            if response.status_code == 200:
                data = response.json()
                for d in data['customs']:
                    setObject(d, self.obstacles)
            self.task = self.loop.create_task(self.game_update())
        
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
        if self.players == 1:
            del self.consumers[self.room_group_name]
            match_result = 2
        elif self.players == 2:
            match_result = 1
        if self.b.is_active == 1:
            self.b.is_active = 0
            backend_url = 'http://backend:8000/match/tournamentresult/' + list(self.room_name.split('_'))[-1]
            game_results = {
                'match_date': datetime.now().isoformat(),
                'match_result': match_result,
                'player1': list(self.room_name.split('_'))[0],
                'player2': list(self.room_name.split('_'))[1]
            }
            response = requests.post(backend_url, json=game_results)

    async def send_message(self):
        while self.message_loop:
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active':self.b.is_active
            }))
            if self.b.is_active == 0:
                self.message_loop = False
            await asyncio.sleep(0.001)

    async def game_update(self):
        while self.game_loop:
            self.dt = (time.perf_counter() - self.lastTime)
            self.lastTime = time.perf_counter()

            self.p1.update(self.p1.dir[1] * 10 * self.dt, self.obstacles[0].bot1[1], self.obstacles[1].top1[1])
            self.p2.update(self.p2.dir[1] * 10 * self.dt, self.obstacles[0].bot1[1], self.obstacles[1].top1[1])
            self.b.pos[2] = 1
            self.b.update(self.paddles, self.obstacles, self.dt * 20)
            self.b.pos[2] = 0
            if self.b.point1 == 5 :
                self.b.is_active = 0
                backend_url = 'http://backend:8000/match/tournamentresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 1,
                    'player1': list(self.room_name.split('_'))[0],
                    'player2': list(self.room_name.split('_'))[1]
                }
                response = requests.post(backend_url, json=game_results)
                
            elif self.b.point2 == 5:
                self.b.is_active = 0
                backend_url = 'http://backend:8000/match/tournamentresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 2,
                    'player1': list(self.room_name.split('_'))[0],
                    'player2': list(self.room_name.split('_'))[1]
                }
                response = requests.post(backend_url, json=game_results)
                
            if self.b.is_active == 0:
                self.game_loop = False
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active' :self.b.is_active
            }))
            await asyncio.sleep(0.001)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        player = text_data_json['players']

        if self.players == None:
            if (player == 1 or player == 2):
               self.players = player
        else:
            player = int(player)
        for i in range(0, 2):
            if (message == 'up' and player == i + 1):
                self.paddles[i].dir[1] = 1
            if (message == 'down' and player == i + 1):
                self.paddles[i].dir[1] = -1
            if (message == 'upstop' and self.paddles[i].dir[1] == 1 and player == i + 1):
                self.paddles[i].dir[1] = 0
            if (message == 'downstop' and self.paddles[i].dir[1] == -1 and player == i + 1):
                self.paddles[i].dir[1] = 0

class MultiGameConsumer(AsyncWebsocketConsumer):
    consumers = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dt = 0
        self.lastTime = 0
        self.players = None
        self.b = ball.Ball(0.5)
        self.p1 = ball.Stick([-15,1.5,0], 0.5, 3)
        self.p2 = ball.Stick([15,1.5,0], 0.5, 3)
        self.p3 = ball.Stick([-15,-1.5,0], 0.5, 3)
        self.p4 = ball.Stick([15,-1.5,0], 0.5, 3)
        self.paddles = []
        self.obstacles = []
        self.message_loop = True
        self.game_loop = True

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name}'
        self.loop = asyncio.get_event_loop()
    
        await self.accept()

        if self.room_group_name in self.consumers:
            self.consumer = self.consumers[self.room_group_name]
            self.b = self.consumers[self.room_group_name].b
            self.p1 = self.consumers[self.room_group_name].p1
            self.p2 = self.consumers[self.room_group_name].p2
            self.p3 = self.consumers[self.room_group_name].p3
            self.p4 = self.consumers[self.room_group_name].p4
            self.paddles = self.consumers[self.room_group_name].paddles
            self.obstacles = self.consumers[self.room_group_name].obstacles
            self.task = self.loop.create_task(self.send_message())
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.paddles.append(self.p1)
            self.paddles.append(self.p2)
            self.paddles.append(self.p3)
            self.paddles.append(self.p4)
            self.obstacles.append(ball.Box(30, 0.5))
            self.obstacles[0].movePos([0, 8, 0])
            self.obstacles.append(ball.Box(30, 0.5))
            self.obstacles[1].movePos([0, -8, 0])
            backend_url = 'http://backend:8000/match/updatemulticustom/' + list(self.room_name.split('_'))[-1]
            params= { 'match_id': list(self.room_name.split('_'))[-1] }
            response = requests.get(backend_url, params=params)
            if response.status_code == 200:
                data = response.json()
                for d in data['customs']:
                    setObject(d, self.obstacles)
            self.task = self.loop.create_task(self.game_update())
        
        await self.send(text_data=json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'paddle3_pos': self.p3.pos,
            'paddle4_pos': self.p4.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active':self.b.is_active
            }))

    async def disconnect(self, close_code):
        self.task.cancel()
        if self.players == 1 or self.players == 3:
            del self.consumers[self.room_group_name]
            match_result = 2
        elif self.players == 2 or self.players == 4:
            match_result = 1
        if self.b.is_active == 1 :
            self.b.is_active = 0
            backend_url = 'http://backend:8000/match/multimatchresult/' + list(self.room_name.split('_'))[-1]
            game_results = {
                'match_date': datetime.now().isoformat(),
                'match_result': match_result,
                'is_active': False,
            }
            response = requests.post(backend_url, json=game_results)

    async def send_message(self):
        while self.message_loop:
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'paddle3_pos': self.p3.pos,
            'paddle4_pos': self.p4.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active':self.b.is_active
            }))
            if self.b.is_active == 0:
                self.message_loop = False
            await asyncio.sleep(0.001)

    async def game_update(self):
        while self.game_loop:
            self.dt = (time.perf_counter() - self.lastTime)
            self.lastTime = time.perf_counter()

            map_length = self.obstacles[0].bot1[1] - self.obstacles[1].top1[1]
            self.p1.update(self.p1.dir[1] * 10 * self.dt, self.obstacles[0].bot1[1], self.obstacles[1].top1[1] + map_length / 2)
            self.p2.update(self.p2.dir[1] * 10 * self.dt, self.obstacles[0].bot1[1], self.obstacles[1].top1[1] + map_length / 2)
            self.p3.update(self.p3.dir[1] * 10 * self.dt, self.obstacles[0].bot1[1] - map_length / 2, self.obstacles[1].top1[1])
            self.p4.update(self.p4.dir[1] * 10 * self.dt, self.obstacles[0].bot1[1] - map_length / 2, self.obstacles[1].top1[1])
            self.b.pos[2] = 1
            self.b.update(self.paddles, self.obstacles, self.dt * 20)
            self.b.pos[2] = 0
            if self.b.point1 == 5 :
                self.b.is_active = 0
                backend_url = 'http://backend:8000/match/multimatchresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 1,
                    'is_active': False,
                }
                response = requests.post(backend_url, json=game_results)
                
            elif self.b.point2 == 5:
                self.b.is_active = 0
                backend_url = 'http://backend:8000/match/multimatchresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 2,
                    'is_active': False,
                }
                response = requests.post(backend_url, json=game_results)
                
            if self.b.is_active == 0:
                self.game_loop = False
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'paddle3_pos': self.p3.pos,
            'paddle4_pos': self.p4.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active' : self.b.is_active
            }))
            await asyncio.sleep(0.001)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        player = text_data_json['players']

        if self.players == None:
            if (player == 1 or player == 2 or player == 3 or player == 4):
               self.players = player
        else:
            player = int(player)
        for i in range(0, 4):
            if (message == 'up' and player == i + 1):
                self.paddles[i].dir[1] = 1
            if (message == 'down' and player == i + 1):
                self.paddles[i].dir[1] = -1
            if (message == 'upstop' and self.paddles[i].dir[1] == 1 and player == i + 1):
                self.paddles[i].dir[1] = 0
            if (message == 'downstop' and self.paddles[i].dir[1] == -1 and player == i + 1):
                self.paddles[i].dir[1] = 0

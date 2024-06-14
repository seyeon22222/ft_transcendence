import json
import asyncio
import time
import requests
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from . import ball

class GameConsumer(AsyncWebsocketConsumer):
    consumers = {}  # 클래스 변수, Consumer 인스턴스를 저장할 딕셔너리

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dt = 0
        self.lastTime = 0
        self.players = None
        self.b = ball.Ball(0.5)
        self.p1 = ball.Stick([-15,1.5,0], 0.5, 3)
        self.p2 = ball.Stick([15,1.5,0], 0.5, 3)
        self.paddles = []
        self.obtacles = []

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
            self.obtacles = self.consumers[self.room_group_name].obtacles
            self.task = self.loop.create_task(self.send_message())
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.paddles.append(self.p1)
            self.paddles.append(self.p2)
            self.obtacles.append(ball.Box(30, 0.5))
            self.obtacles[0].movePos([0, 8, 0])
            self.obtacles.append(ball.Box(30, 0.5))
            self.obtacles[1].movePos([0, -8, 0])
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
        print("=======================================self.players : " + str(self.players) + " self.is_active : " + str(self.b.is_active) + "=====================")
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
        while True:
            # 클라이언트로 메시지 보내기
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active':self.b.is_active
            }))
            # 초 대기
            await asyncio.sleep(0.001)

    async def game_update(self):
        while self.b.is_active:
            self.dt = (time.perf_counter() - self.lastTime)
            self.lastTime = time.perf_counter()

            self.p1.update(self.p1.dir[1] * 10 * self.dt, self.obtacles[0].bot1[1], self.obtacles[1].top1[1])
            self.p2.update(self.p2.dir[1] * 10 * self.dt, self.obtacles[0].bot1[1], self.obtacles[1].top1[1])
            self.b.pos[2] = 1
            self.b.update(self.paddles, self.obtacles, self.dt * 20)
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
                # print(response.status_code)
                # print(response.text)
            elif self.b.point2 == 5:
                self.b.is_active = 0
                backend_url = 'http://backend:8000/match/matchresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 2,
                    'is_active': False,
                }
                response = requests.post(backend_url, json=game_results)
                # print(response.status_code)
                # print(response.text)
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active' :self.b.is_active
            }))
            # 초 대기
            await asyncio.sleep(0.001)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        player = text_data_json['players']

        if self.players == None:
            if (player == 1 or player == 2):
               self.players = player
            # else:
            #     if (uuid == (self.room_name.split('_'))[1]):
            #         self.players = 1
            #     else: 
            #         self.players = 2
        else:
        #     if (uuid == (self.room_name.split('_'))[1]):
        #         self.players = 1
        #     else: 
        #         self.players = 2
        #     print('uuid: ' + uuid + " ===== "+(self.room_name.split('_'))[1] + " ===== " + str(self.players))
        # else:
        #     if player == None
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
    consumers = {}  # 클래스 변수, Consumer 인스턴스를 저장할 딕셔너리

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dt = 0
        self.lastTime = 0
        self.players = None
        self.b = ball.Ball(0.5)
        self.p1 = ball.Stick([-15,1.5,0], 0.5, 3)
        self.p2 = ball.Stick([15,1.5,0], 0.5, 3)
        self.paddles = []
        self.obtacles = []

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
            self.obtacles = self.consumers[self.room_group_name].obtacles
            self.task = self.loop.create_task(self.send_message())
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.paddles.append(self.p1)
            self.paddles.append(self.p2)
            self.obtacles.append(ball.Box(30, 0.5))
            self.obtacles[0].movePos([0, 8, 0])
            self.obtacles.append(ball.Box(30, 0.5))
            self.obtacles[1].movePos([0, -8, 0])
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
        print("=======================================self.players : " + str(self.players) + " self.is_active : " + str(self.b.is_active) + "=====================")
        if self.players == 1:
            del self.consumers[self.room_group_name]
            match_result = 2
        elif self.players == 2:
            match_result = 1
        if self.b.is_active == 1:
            self.b.is_active = 0
            backend_url = 'http://backend:8000/match/t_matchresult/' + list(self.room_name.split('_'))[-1]
            game_results = {
                'match_date': datetime.now().isoformat(),
                'match_result': match_result,
                'is_active': False,
            }
            response = requests.post(backend_url, json=game_results)

    async def send_message(self):
        while True:
            # 클라이언트로 메시지 보내기
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active':self.b.is_active
            }))
            # 초 대기
            await asyncio.sleep(0.001)

    async def game_update(self):
        while self.b.is_active:
            self.dt = (time.perf_counter() - self.lastTime)
            self.lastTime = time.perf_counter()

            self.p1.update(self.p1.dir[1] * 10 * self.dt, self.obtacles[0].bot1[1], self.obtacles[1].top1[1])
            self.p2.update(self.p2.dir[1] * 10 * self.dt, self.obtacles[0].bot1[1], self.obtacles[1].top1[1])
            self.b.pos[2] = 1
            self.b.update(self.paddles, self.obtacles, self.dt * 20)
            self.b.pos[2] = 0
            if self.b.point1 == 5 :
                self.b.is_active = 0
                backend_url = 'http://backend:8000/match/t_matchresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 1,
                    'is_active': False,
                }
                response = requests.post(backend_url, json=game_results)
                # print(response.status_code)
                # print(response.text)
            elif self.b.point2 == 5:
                self.b.is_active = 0
                backend_url = 'http://backend:8000/match/t_matchresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 2,
                    'is_active': False,
                }
                response = requests.post(backend_url, json=game_results)
                # print(response.status_code)
                # print(response.text)
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'is_active' :self.b.is_active
            }))
            # 초 대기
            await asyncio.sleep(0.001)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        player = text_data_json['players']

        if self.players == None:
            if (player == 1 or player == 2):
               self.players = player
            # else:
            #     if (uuid == (self.room_name.split('_'))[1]):
            #         self.players = 1
            #     else: 
            #         self.players = 2
        else:
        #     if (uuid == (self.room_name.split('_'))[1]):
        #         self.players = 1
        #     else: 
        #         self.players = 2
        #     print('uuid: ' + uuid + " ===== "+(self.room_name.split('_'))[1] + " ===== " + str(self.players))
        # else:
        #     if player == None
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
    consumers = {}  # 클래스 변수, Consumer 인스턴스를 저장할 딕셔너리

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
        self.obtacles = []

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
            self.obtacles = self.consumers[self.room_group_name].obtacles
            self.task = self.loop.create_task(self.send_message())
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.paddles.append(self.p1)
            self.paddles.append(self.p2)
            self.paddles.append(self.p3)
            self.paddles.append(self.p4)
            self.obtacles.append(ball.Box(30, 0.5))
            self.obtacles[0].movePos([0, 8, 0])
            self.obtacles.append(ball.Box(30, 0.5))
            self.obtacles[1].movePos([0, -8, 0])
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
        print("=======================================self.players : " + str(self.players) + " self.is_active : " + str(self.b.is_active) + "=====================")
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
        while True:
            # 클라이언트로 메시지 보내기
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
            # 초 대기
            await asyncio.sleep(0.001)

    async def game_update(self):
        while self.b.is_active:
            self.dt = (time.perf_counter() - self.lastTime)
            self.lastTime = time.perf_counter()

            map_length = self.obtacles[0].bot1[1] - self.obtacles[1].top1[1]
            self.p1.update(self.p1.dir[1] * 10 * self.dt, self.obtacles[0].bot1[1], self.obtacles[1].top1[1] + map_length / 2)
            self.p2.update(self.p2.dir[1] * 10 * self.dt, self.obtacles[0].bot1[1], self.obtacles[1].top1[1] + map_length / 2)
            self.p3.update(self.p3.dir[1] * 10 * self.dt, self.obtacles[0].bot1[1] - map_length / 2, self.obtacles[1].top1[1])
            self.p4.update(self.p4.dir[1] * 10 * self.dt, self.obtacles[0].bot1[1] - map_length / 2, self.obtacles[1].top1[1])
            self.b.pos[2] = 1
            self.b.update(self.paddles, self.obtacles, self.dt * 20)
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
                # print(response.status_code)
                # print(response.text)
            elif self.b.point2 == 5:
                self.b.is_active = 0
                backend_url = 'http://backend:8000/match/multimatchresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 2,
                    'is_active': False,
                }
                response = requests.post(backend_url, json=game_results)
                # print(response.status_code)
                # print(response.text)
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
            # 초 대기
            await asyncio.sleep(0.001)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        player = text_data_json['pid']

        if self.players == None:
            if (player == 1 or player == 2 or player == 3 or player == 4):
               self.players = player
            # else:
            #     if (uuid == (self.room_name.split('_'))[1]):
            #         self.players = 1
            #     else: 
            #         self.players = 2
        else:
        #     if (uuid == (self.room_name.split('_'))[1]):
        #         self.players = 1
        #     else: 
        #         self.players = 2
        #     print('uuid: ' + uuid + " ===== "+(self.room_name.split('_'))[1] + " ===== " + str(self.players))
        # else:
        #     if player == None
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
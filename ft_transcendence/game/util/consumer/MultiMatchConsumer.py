import json
import asyncio
import time
import requests
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from .. import ball

class MultiMatchConsumer(AsyncWebsocketConsumer):
    consumer_repository = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.delta_time = 0
        self.last_time = 0
        self.id = None
        self.ball = ball.Ball(0.5)
        self.paddle1 = ball.Stick([-15,1.5,0], 0.5, 3)
        self.paddle2 = ball.Stick([15,1.5,0], 0.5, 3)
        self.paddle3 = ball.Stick([-15,-1.5,0], 0.5, 3)
        self.paddle4 = ball.Stick([15,-1.5,0], 0.5, 3)
        self.paddle_repository = []
        self.obstacle_repository = []
        self.message_loop = True
        self.game_loop = True

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name}'
        self.loop = asyncio.get_event_loop()
    
        await self.accept()

        if self.room_group_name in self.consumer_repository:
            self.consumer = self.consumer_repository[self.room_group_name]
            self.ball = self.consumer_repository[self.room_group_name].ball
            self.paddle1 = self.consumer_repository[self.room_group_name].paddle1
            self.paddle2 = self.consumer_repository[self.room_group_name].paddle2
            self.paddle3 = self.consumer_repository[self.room_group_name].paddle3
            self.paddle4 = self.consumer_repository[self.room_group_name].paddle4
            self.paddle_repository = self.consumer_repository[self.room_group_name].paddle_repository
            self.obstacle_repository = self.consumer_repository[self.room_group_name].obstacle_repository
            self.task = self.loop.create_task(self.send_message())
        else:
            self.consumer = self
            self.consumer_repository[self.room_group_name] = self
            self.paddle_repository.append(self.paddle1)
            self.paddle_repository.append(self.paddle2)
            self.paddle_repository.append(self.paddle3)
            self.paddle_repository.append(self.paddle4)
            self.obstacle_repository.append(ball.Box(30, 0.5))
            self.obstacle_repository[0].movePos([0, 8, 0])
            self.obstacle_repository.append(ball.Box(30, 0.5))
            self.obstacle_repository[1].movePos([0, -8, 0])
            self.task = self.loop.create_task(self.game_update())
        
        await self.send(text_data=json.dumps({
            'ball_pos': self.ball.pos,
            'paddle1_pos': self.paddle1.pos,
            'paddle2_pos': self.paddle2.pos,
            'paddle3_pos': self.paddle3.pos,
            'paddle4_pos': self.paddle4.pos,
            'score1': self.ball.point1,
            'score2': self.ball.point2,
            'is_active':self.ball.is_active
            }))

    async def disconnect(self, close_code):
        self.task.cancel()
        if self.id == 1 or self.id == 3:
            del self.consumer_repository[self.room_group_name]
            match_result = 2
        elif self.id == 2 or self.id == 4:
            match_result = 1
        if self.ball.is_active == 1 :
            self.ball.is_active = 0
            backend_url = 'http://backend:8000/match/multimatchresult/' + list(self.room_name.split('_'))[-1]
            game_results = {
                'match_date': datetime.now().isoformat(),
                'match_result': match_result,
                'is_active': False,
            }
            response = requests.post(backend_url, json=game_results)

    async def send_message(self):
        while self.message_loop:
            # 클라이언트로 메시지 보내기
            await self.send(json.dumps({
            'ball_pos': self.ball.pos,
            'paddle1_pos': self.paddle1.pos,
            'paddle2_pos': self.paddle2.pos,
            'paddle3_pos': self.paddle3.pos,
            'paddle4_pos': self.paddle4.pos,
            'score1': self.ball.point1,
            'score2': self.ball.point2,
            'is_active':self.ball.is_active
            }))
            if self.ball.is_active == 0:
                self.message_loop = False
            # 초 대기
            await asyncio.sleep(0.001)

    async def game_update(self):
        while self.game_loop:
            self.delta_time = (time.perf_counter() - self.last_time)
            self.last_time = time.perf_counter()

            map_length = self.obstacle_repository[0].bot1[1] - self.obstacle_repository[1].top1[1]
            self.paddle1.update(self.paddle1.dir[1] * 10 * self.delta_time, self.obstacle_repository[0].bot1[1], self.obstacle_repository[1].top1[1] + map_length / 2)
            self.paddle2.update(self.paddle2.dir[1] * 10 * self.delta_time, self.obstacle_repository[0].bot1[1], self.obstacle_repository[1].top1[1] + map_length / 2)
            self.paddle3.update(self.paddle3.dir[1] * 10 * self.delta_time, self.obstacle_repository[0].bot1[1] - map_length / 2, self.obstacle_repository[1].top1[1])
            self.paddle4.update(self.paddle4.dir[1] * 10 * self.delta_time, self.obstacle_repository[0].bot1[1] - map_length / 2, self.obstacle_repository[1].top1[1])
            self.ball.pos[2] = 1
            self.ball.update(self.paddle_repository, self.obstacle_repository, self.delta_time * 20)
            self.ball.pos[2] = 0
            if self.ball.point1 == 5 :
                self.ball.is_active = 0
                backend_url = 'http://backend:8000/match/multimatchresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 1,
                    'is_active': False,
                }
                response = requests.post(backend_url, json=game_results)
            elif self.ball.point2 == 5:
                self.ball.is_active = 0
                backend_url = 'http://backend:8000/match/multimatchresult/' + list(self.room_name.split('_'))[-1]
                game_results = {
                    'match_date': datetime.now().isoformat(),
                    'match_result': 2,
                    'is_active': False,
                }
                response = requests.post(backend_url, json=game_results)
            if self.ball.is_active == 0:
                self.game_loop = False
            await self.send(json.dumps({
            'ball_pos': self.ball.pos,
            'paddle1_pos': self.paddle1.pos,
            'paddle2_pos': self.paddle2.pos,
            'paddle3_pos': self.paddle3.pos,
            'paddle4_pos': self.paddle4.pos,
            'score1': self.ball.point1,
            'score2': self.ball.point2,
            'is_active' : self.ball.is_active
            }))
            # 초 대기
            await asyncio.sleep(0.001)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        player = text_data_json['pid']

        if self.id == None:
            if (player == 1 or player == 2 or player == 3 or player == 4):
               self.id = player
        else:
            player = int(player)
        for i in range(0, 4):
            if (message == 'up' and player == i + 1):
                self.paddle_repository[i].dir[1] = 1
            if (message == 'down' and player == i + 1):
                self.paddle_repository[i].dir[1] = -1
            if (message == 'upstop' and self.paddle_repository[i].dir[1] == 1 and player == i + 1):
                self.paddle_repository[i].dir[1] = 0
            if (message == 'downstop' and self.paddle_repository[i].dir[1] == -1 and player == i + 1):
                self.paddle_repository[i].dir[1] = 0

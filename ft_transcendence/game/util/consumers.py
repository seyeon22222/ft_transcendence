import json
import asyncio
import time

from channels.generic.websocket import AsyncWebsocketConsumer
import threading
from . import ball

class GameConsumer(AsyncWebsocketConsumer):
    consumers = {}  # 클래스 변수, Consumer 인스턴스를 저장할 딕셔너리
    lock = threading.Lock()

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dt = 0
        self.lastTime = 0
        self.players = 0
        self.b = ball.Ball()
        self.p1 = ball.Stick([-15,0,0])
        self.p2 = ball.Stick([15,0,0])

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['slug_name']
        self.room_group_name = f'game_{self.room_name}'
        self.loop = asyncio.get_event_loop()

        with self.lock:
            if self.room_group_name in self.consumers:
                self.consumer = self.consumers[self.room_group_name]
                self.b = self.consumers[self.room_group_name].b
                self.p1 = self.consumers[self.room_group_name].p1
                self.p2 = self.consumers[self.room_group_name].p2
                self.players = 2
                self.task = self.loop.create_task(self.send_message())
            else:
                self.consumer = self
                self.consumers[self.room_group_name] = self
                self.players = 1
                self.task = self.loop.create_task(self.game_update())
        
        await self.accept()
        
        await self.send(text_data=json.dumps({
            "players": self.players,
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            }))

    async def disconnect(self, close_code):
        self.task.cancel()

    async def send_message(self):
        while True:
            # 클라이언트로 메시지 보내기
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            }))
            # 초 대기
            await asyncio.sleep(0.001)

    async def game_update(self):
        while True:
            self.dt = (time.perf_counter() - self.lastTime)
            self.lastTime = time.perf_counter()

            self.p1.update(self.p1.dir[1] * 10 * self.dt)
            self.p2.update(self.p2.dir[1] * 10 * self.dt)
            self.b.update(self.p1, self.p2, self.dt * 20)

            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            }))
            # 초 대기
            await asyncio.sleep(0.001)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        player = text_data_json['players']

        if player is not None:
            player = int(player)
        if (message == '1pup' and player % 2 == 1):
            self.p1.dir[1] = 1
        if (message == '1pdown' and player % 2 == 1):
            self.p1.dir[1] = -1
        if (message == '2pup' and player % 2 == 0):
            self.p2.dir[1] = 1
        if (message == '2pdown' and player % 2 == 0):
            self.p2.dir[1] = -1
        if (message == '1pupstop' and self.p1.dir[1] == 1 and player % 2 == 1):
            self.p1.dir[1] = 0
        if (message == '1pdownstop' and self.p1.dir[1] == -1 and player % 2 == 1):
            self.p1.dir[1] = 0
        if (message == '2pupstop' and self.p2.dir[1] == 1 and player % 2 == 0):
            self.p2.dir[1] = 0
        if (message == '2pdownstop' and self.p2.dir[1] == -1 and player % 2 == 0):
            self.p2.dir[1] = 0
import json
import asyncio
import time
import psycopg2
import requests
from datetime import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from . import ball
from . import models
import psycopg2

class GameConsumer(AsyncWebsocketConsumer):
    consumers = {}  # 클래스 변수, Consumer 인스턴스를 저장할 딕셔너리

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.dt = 0
        self.lastTime = 0
        self.players = None
        self.b = ball.Ball()
        self.p1 = ball.Stick([-15,0,0])
        self.p2 = ball.Stick([15,0,0])
        self.end = True

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
            self.end = self.consumers[self.room_group_name].end
            self.task = self.loop.create_task(self.send_message())
        else:
            self.consumer = self
            self.consumers[self.room_group_name] = self
            self.task = self.loop.create_task(self.game_update())

        await self.send(text_data=json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'end':self.end
            }))

    async def disconnect(self, close_code):
        self.task.cancel()
        if self.players == 1:
            del self.consumers[self.room_group_name]

    async def send_message(self):
        while self.end:
            # 클라이언트로 메시지 보내기
            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'end':self.end
            }))
            # 초 대기
            await asyncio.sleep(0.001)

    async def game_update(self):
        while self.end:
            self.dt = (time.perf_counter() - self.lastTime)
            self.lastTime = time.perf_counter()

            self.p1.update(self.p1.dir[1] * 10 * self.dt)
            self.p2.update(self.p2.dir[1] * 10 * self.dt)
            self.b.update(self.p1, self.p2, self.dt * 20)

            if self.b.point1 == 5 :

                self.end = False
                split_list = list(self.room_name.split('_'))
                if split_list[0] == 'm':
                    backend_url = 'http://backend:8000/match/matchresult/' + split_list[-1]
                    game_results = {
                        'match_date': datetime.now().isoformat(),
                        'match_result': 1,
                        'is_active': False,
                    }
                elif split_list[0] == 't':
                    backend_url = 'http://backend:8000/match/t_matchresult/' + split_list[-1]
                    game_results = {
                        'match_date': datetime.now().isoformat(),
                        'match_result': 1,
                        'player1': split_list[1],
                        'player2': split_list[2],
                    }
                response = requests.post(backend_url, json=game_results)

            elif self.b.point2 == 5:

                self.end = False
                split_list = list(self.room_name.split('_'))
                if split_list[0] == 'm':
                    backend_url = 'http://backend:8000/match/matchresult/' + split_list[-1]
                    game_results = {
                        'match_date': datetime.now().isoformat(),
                        'match_result': 2,
                        'is_active': False,
                    }
                elif split_list[0] == 't':
                    backend_url = 'http://backend:8000/match/t_matchresult/' + split_list[-1]
                    game_results = {
                        'match_date': datetime.now().isoformat(),
                        'match_result': 2,
                        'player1': split_list[1],
                        'player2': split_list[2],
                    }
                response = requests.post(backend_url, json=game_results)

            await self.send(json.dumps({
            'ball_pos': self.b.pos,
            'paddle1_pos': self.p1.pos,
            'paddle2_pos': self.p2.pos,
            'score1': self.b.point1,
            'score2': self.b.point2,
            'end' :self.end
            }))
            # 초 대기
            await asyncio.sleep(0.001)
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        player = text_data_json['players']
        uuid = text_data_json['uuid']

        if self.players is None:
            if (uuid == (self.room_name.split('_'))[1]):
                self.players = 1
            else: 
                self.players = 2
            print('uuid: ' + uuid + " ===== "+(self.room_name.split('_'))[1] + " ===== " + str(self.players))
        else:
            if player is None:
                player = self.players
            player = int(player)
            if (message == '1pup' and player == 1):
                self.p1.dir[1] = 1
            if (message == '1pdown' and player == 1):
                self.p1.dir[1] = -1
            if (message == '2pup' and player == 2):
                self.p2.dir[1] = 1
            if (message == '2pdown' and player == 2):
                self.p2.dir[1] = -1
            if (message == '1pupstop' and self.p1.dir[1] == 1 and player == 1):
                self.p1.dir[1] = 0
            if (message == '1pdownstop' and self.p1.dir[1] == -1 and player == 1):
                self.p1.dir[1] = 0
            if (message == '2pupstop' and self.p2.dir[1] == 1 and player == 2):
                self.p2.dir[1] = 0
            if (message == '2pdownstop' and self.p2.dir[1] == -1 and player == 2):
                self.p2.dir[1] = 0
        #데이터베이스 조회
        
        # conn = psycopg2.connect(
        #     host="db",
        #     database="ft_db",
        #     user="admin",
        #     password="qwer1234!"
        # )
        # cur = conn.cursor()
        # cur.execute("SELECT * FROM ft_user_myuser")
        # rows = cur.fetchall()

        # for row in rows:
        #     print(list(row)[9])
        #     print(" : row\n")

        # conn.close()
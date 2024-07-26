import json
from channels.generic.websocket import AsyncWebsocketConsumer
from . import tinfo

class MatchConsumer(AsyncWebsocketConsumer):
    consumers = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.info = tinfo.Tinfo()

    async def connect(self):
        self.tournament_id = self.scope['url_route']['kwargs']['tournament_id']
        self.room_group_name = f'tournament_{self.tournament_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        if self.room_group_name in self.consumers:
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

        if (self.info.player_count == 0):
            del self.consumers[self.room_group_name]
            
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'tournament_message',
                'message': message
            }
        )

    async def tournament_message(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'message': message
        }))

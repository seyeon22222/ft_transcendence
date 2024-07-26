import json
from channels.generic.websocket import AsyncWebsocketConsumer

class messageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user_id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'user_{self.user_id}'

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        flag = False
        data = json.loads(text_data)
        message = data['message']
        player1 = data.get('player1')
        player2 = data.get('player2')
        g_type = data.get('g_type')
        g_id = data.get('g_id')
        if data.get('player3') is not None and data.get('player4') is not None:
            flag = True
            player3 = data.get('player3')
            player4 = data.get('player4')
        if flag == True:
            await self.send(text_data=json.dumps({
            'type' : 'message',
            'message': message,
            'player1' : player1,
            'player2' : player2,
            'player3' : player3,
            'player4' : player4,
            'g_type' : g_type,
            'g_id' : g_id,
        }))
        else :
            await self.send(text_data=json.dumps({
            'type' : 'message',
            'message': message,
            'player1' : player1,
            'player2' : player2,
            'g_type' : g_type,
            'g_id' : g_id,
        }))

    async def message(self, event):
        flag = False
        message = event['message']
        player1 = event.get('player1')
        player2 = event.get('player2')
        g_type = event.get('g_type')
        g_id = event.get('g_id')
        if event.get('player3') is not None and event.get('player4') is not None:
            flag = True
            player3 = event.get('player3')
            player4 = event.get('player4')
        if flag == True:
            await self.send(text_data=json.dumps({
            'type' : 'message',
            'message': message,
            'player1' : player1,
            'player2' : player2,
            'player3' : player3,
            'player4' : player4,
            'g_type' : g_type,
            'g_id' : g_id,
        }))
        else:
            await self.send(text_data=json.dumps({
            'type' : 'message',
            'message': message,
            'player1' : player1,
            'player2' : player2,
            'g_type' : g_type,
            'g_id' : g_id,
        }))
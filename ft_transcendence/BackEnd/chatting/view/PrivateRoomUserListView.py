from rest_framework.views import APIView
from rest_framework.response import Response
from ..model import PrivateRoom

class PrivateRoomUserListView(APIView):

    def get(self, request, slug):
        private_room = PrivateRoom.PrivateRoom.objects.get(slug=slug)

        if private_room:
            user1 = private_room.user1
            user2 = private_room.user2
            return Response({'user1': user1.username, 'user2': user2.username}, status=200)
        else:
            return Response(status=404)
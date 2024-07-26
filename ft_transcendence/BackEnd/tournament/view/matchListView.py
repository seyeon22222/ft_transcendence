from rest_framework.views import APIView
from rest_framework.response import Response
from ..model import Match
from ..serializer import matchSerializer

class matchListView(APIView):

    def get(self, request):
        matchs = Match.Match.objects.all()
        serializer = matchSerializer.matchSerializer(matchs, many=True)
        return Response(serializer.data)
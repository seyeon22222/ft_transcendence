from rest_framework.views import APIView
from rest_framework.response import Response
from ..model import MultiMatch
from ..serializer import MultiSerializer


class MultiMatchListView(APIView):

    def get(self, request):
        multiMatch = MultiMatch.MultiMatch.objects.all()
        serializer = MultiSerializer.MultiSerializer(multiMatch, many=True)
        return Response(serializer.data)
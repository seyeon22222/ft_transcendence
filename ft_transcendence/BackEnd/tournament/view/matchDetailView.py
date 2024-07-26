from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import Match
from ..serializer import matchSerializer
from django.shortcuts import get_object_or_404

class matchDetailView(APIView):

    def get(self, request, match_id):
        match = get_object_or_404(Match.Match, id=match_id)
        serializer = matchSerializer.matchSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)
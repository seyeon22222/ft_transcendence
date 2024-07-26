from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import MultiMatch
from ..serializer import MultiSerializer
from django.shortcuts import get_object_or_404

class MultiMatchDetailView(APIView):
    def get(self, request, multimatch_id):
        match = get_object_or_404(MultiMatch.MultiMatch, id=multimatch_id)
        serializer = MultiSerializer.MultiSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)    
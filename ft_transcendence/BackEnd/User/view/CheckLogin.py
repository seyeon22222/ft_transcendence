from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class CheckLogin(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=301)
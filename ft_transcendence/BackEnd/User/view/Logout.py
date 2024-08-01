from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import logout

class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response({'message' : "로그아웃 성공"}, status=status.HTTP_200_OK)
        else:
            return Response({'message' : "로그인이 되어 있지 않음"}, status=status.HTTP_400_BAD_REQUEST)
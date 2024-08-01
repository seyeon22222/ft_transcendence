from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from ..serializer import UserSerializer
from ..model import MyUser
from ..utils import validate_input, validate_password
from django.contrib.auth import authenticate, login

class User_login(APIView):

    queryset = MyUser.MyUser.objects.all()
    serializer_class = UserSerializer.UserSerializer
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        check, message = validate_input(username)
        if not check:
            return Response({'message': message}, status=status.HTTP_400_BAD_REQUEST)
        
        check, message = validate_password(username, password)
        if not check:
            return Response({'message': message}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return Response({'message': "로그인 성공"}, status=status.HTTP_200_OK)
        else:
            return Response({'message': "로그인 실패"}, status=status.HTTP_400_BAD_REQUEST)
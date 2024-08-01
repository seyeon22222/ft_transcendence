from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..utils import validate_input, validate_email
from ..model import MyUser
from django.core.files.storage import default_storage


class UserInfoChange(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        if user is not None:
            username = request.data.get('username')
            email = request.data.get('email')
            profile_picture = request.FILES.get('profile_picture')

            if username:
                check, message = validate_input(username)
                if not check:
                    return Response({'message': message}, status=status.HTTP_400_BAD_REQUEST)
                
                if MyUser.MyUser.objects.filter(username = username).exists():
                    return Response({'message': '이미 해당 유저네임이 존재합니다'}, status=status.HTTP_400_BAD_REQUEST)
                user.username = username

            if email:
                check, message = validate_email(email)
                if not check:
                    return Response({'message': message}, status=status.HTTP_400_BAD_REQUEST)
                user.email = email

            if profile_picture:
                if user.profile_picture:
                    default_storage.delete(user.profile_picture.name)
                user.profile_picture = profile_picture

            user.save()
            return Response({'message': '유저 정보 변경 성공'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': '유저 정보가 없습니다.'}, status=status.HTTP_400_BAD_REQUEST)
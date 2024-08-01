from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from ..model import MyUser
from ..utils import validate_input, validate_password, validate_email
from User.forms import signForm

class Sign_up(APIView):

    def post(self, request):
        form = signForm(request.POST, request.FILES)

        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']
            profile_picture = request.FILES.get('profile_picture')

            valid, message = validate_input(username)
            if not valid:
                return Response({'message': message}, status=status.HTTP_400_BAD_REQUEST)
            
            valid, message = validate_password(username, password)
            if not valid:
                return Response({'message': message}, status=status.HTTP_400_BAD_REQUEST)

            valid, message = validate_email(email)
            if not valid:
                return Response({'message': message}, status=status.HTTP_400_BAD_REQUEST)

            user = MyUser.MyUser.objects.create_user(username, email=email, password=password)
            if profile_picture:
                user.profile_picture = profile_picture
            if profile_picture:
                user.profile_picture = profile_picture
            user.save()
            return Response({'message': "유저 생성 완료"}, status=status.HTTP_200_OK)
        else:
            return Response({'message': "유저 생성 실패"}, status=status.HTTP_400_BAD_REQUEST)
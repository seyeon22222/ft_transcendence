from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    UserSerializer,
    FriendSerializer,
)
from .models import MyUser
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate, login, logout
from ft_user.models import MyUser, Friends
from ft_user.forms import signForm
from django.http import JsonResponse
from django.contrib.sessions.models import Session
from django.utils import timezone
# Create your views here.

class UserViewSet(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return MyUser.objects.all()

    def get(self, request):
        queryset = MyUser.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_vaild():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

class FriendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        from_user = request.user
        to_user = get_object_or_404(MyUser, id=user_id)
        serializer = FriendSerializer(data = {'from_user' : from_user, 'to_user' : to_user})
        serializer.is_vaild(raise_exception=True)
        friend_request = serializer.save()
        return Response({"message" : "친구 신청을 보냈습니다"}, status = status.HTTP_201_CREATED)
    
class FriendAcceptView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, friend_request_id):
        friend_request = get_object_or_404(Friends, id=friend_request_id)
        if friend_request.to_user != request.user:
            return Response({'message' : "권한이 없습니다."}, status = status.HTTP_403_FORBIDDEN)
        if friend_request.status != 'pending':
            return Response({'message' : "이미 처리된 요청입니다."}, status = status.HTTP_400_BAD_REQUEST)

        friend_request.status = 'accept'
        friend_request.save()
        from_user = friend_request.from_user
        to_user = friend_request.to_user
        from_user.friends.add(to_user)
        return Response({'message' : "친구 요청을 수락했습니다."}, status = status.HTTP_200_OK)
    
class FriendRejectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, friend_request_id):
        friend_request = get_object_or_404(Friends, id=friend_request_id)
        if friend_request.to_user != request.user:
            return Response({'message' : "권한이 없습니다."}, status = status.HTTP_403_FORBIDDEN)
        if friend_request.status != 'pending':
            return Response({'message' : "이미 처리된 요청입니다."}, status = status.HTTP_400_BAD_REQUEST)
        
        friend_request.status = 'reject'
        friend_request.save()

        return Response({'message' : "친구 신청을 거절했습니다."}, status = status.HTTP_200_OK)
    
class FriendDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, friend_request_id):
        friend_request = get_object_or_404(Friends, id=friend_request_id)
        if friend_request.to_user != request.user:
            return Response({'message' : "권한이 없습니다."}, status = status.HTTP_403_FORBIDDEN)
        if friend_request.status != 'accept':
            return Response({'message' : "친구가 아닙니다."}, status = status.HTTP_400_BAD_REQUEST)
        friend_request.status = 'delete'
        friend_request.save()
        return Response({'message' : "친구를 삭제했습니다."}, status = status.HTTP_200_OK)

class User_login(APIView):
    queryset = MyUser.objects.all()
    serializer_class = UserSerializer
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            print("로그인 성공")
            login(request, user)
            return Response({'message': "로그인 성공"}, status=status.HTTP_200_OK)
        else:
            print("로그인 실패")
            return Response({'message': "로그인 실패"}, status=status.HTTP_400_BAD_REQUEST)

class SignupView(APIView):
    def post(self, request):
        return Response(status=status.HTTP_200_OK)

class Sign_up(APIView):
    def post(self, request):
        form = signForm(request.data)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']
            user = MyUser.objects.create_user(username, email=email, password=password)
            user.save()
            return Response({'message' : "유저 생성 완료"}, status = status.HTTP_200_OK)
        else:
            return Response({'message' : "유저 생성 실패"}, status = status.HTTP_400_BAD_REQUEST)

class Logout(APIView):
    def post(self, request):
        logout(request)
        return Response({'message' : "로그아웃 성공"}, status=status.HTTP_200_OK)

class UserLoginView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(status=status.HTTP_200_OK)
    
class CurrentUser(APIView):
    permission_classes = [IsAuthenticated]

    def get_users():
        queryset = MyUser.objects.all()
        active_sessions= Session.objects.filter(expire_date__gte=timezone.now())
        user_list = []
        for session in active_sessions:
            data = session.get_decoded()
            user_list.append(data.get('_auth_user_id', None))
        return MyUser.objects.filter(user_id__in=user_list)
    
    def get(self, request):
        current_users = CurrentUser.get_users()
        usernames = [user.username for user in current_users]
        return Response(usernames.data)


class GetUserData(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = MyUser.objects.all()
        current_user = request.user
        flag = False
        for db in queryset:
            if db.username == current_user.username:
                flag = True
        if flag:
            user_data = {
                'user_id' : current_user.user_id,
                'username': current_user.username,
                'email': current_user.email
            }
            return Response(user_data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        imageURL = request.data.get('image')
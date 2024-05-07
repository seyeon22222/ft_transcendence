from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    UserSerializer,
    FriendSerializer,
)
from .models import MyUser
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from ft_user.models import MyUser, Friends
from ft_user.forms import signForm
# Create your views here.

class UserViewSet(APIView):
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

def firstpage(request):
	return render(request, "firstPage.html")

# def user_login(request):
#     if request.method == "POST":
#         username = request.POST["username"]
#         password = request.POST["password"]
#         user = authenticate(request, username=username, password=password)
#         if user is not None:
#             print("인증 성공")
#             login(request, user)
#             return redirect("ft_user:success")
#         else:
#             # ToDo 중복 사용자 생성 시 에러 발생
#             print("failed")
#             return render(request, "login.html")
#     else:
#         return render(request, "login.html")

class User_login(APIView):
    def post(self, request, user_id):
        user_request = get_object_or_404(MyUser, id=user_id)
        if user_request.username != request.username:
            return Response({'message' : "아이디가 없습니다."}, status = status.HTTP_400_BAD_REQUEST)
        elif user_request.password != request.password:
            return Response({'message' : "패스워드가 틀립니다."}, status = status.HTTP_400_BAD_REQEUST)
        else:
            user = authenticate(request, username=request.username, password=request.password)
            if user is not None:
                print("로그인 성공")
                login(request, user)
                return Response({'message' : "로그인 성공"}, status = status.HTTP_200_OK)
            else:
                 print("로그인 실패")
                 return Response({'message' : "로그인 실패"}, status = status.HTTP_400_BAD_REQUEST)
            
def login_suc(request):
    return render(request, "success.html")

def logout_page(request):
    logout(request)
    return redirect("ft_user:login")


# def sign_up(request):
#     if request.method == "POST":
#         form = signForm(request.POST)
#         if form.is_valid():
#             username = form.cleaned_data['username']
#             password = form.cleaned_data['password']
#             email = form.cleaned_data['email']
#             user = MyUser.objects.create_user(username, email=email, password=password)
#             user.save()
#         return redirect("ft_user:firstpage")
#     else:
#         form = signForm()
#         return render(request, "sign_up.html")
    
class Sign_up(APIView):
    def post(self, request, user_id):
        form = signForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']
            user = MyUser.objects.create_user(username, email=email, password=password)
            user.save()
        return Response({'message' : "유저 생성 완료"}, status = status.HTTP_200_OK)


def pong_with_com(request):
    return render(request, "pong.html")
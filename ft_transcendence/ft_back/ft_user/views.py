from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework import status, viewsets
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
from django.views.generic import View, TemplateView
from django.http import JsonResponse

import os
from django.http import HttpResponse  # Import HttpResponse
# Create your views here.

class UserViewSet(APIView):
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return MyUser.objects.all()

    def get(self, request, user_id):
        queryset = MyUser.objects.all()
        serializer = UserSerializer(queryset, many=True)
        print(user_id)
        print(queryset)
        print(request)
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

# class Sign_up(APIView):

#     def post(self, request):
#         form = signForm(request.data)
#         if form.is_valid():
#             username = form.cleaned_data['username']
#             password = form.cleaned_data['password']
#             email = form.cleaned_data['email']
#             user = MyUser.objects.create_user(username, email=email, password=password)
#             user.save()
#             return Response({'message' : "유저 생성 완료"}, status = status.HTTP_200_OK)
#         else:
#             return Response({'message' : "유저 생성 실패"}, status = status.HTTP_400_BAD_REQUEST)

class Sign_up(APIView):

    def post(self, request):
        form = signForm(request.POST, request.FILES)  # Include request.FILES for handling file uploads

        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            email = form.cleaned_data['email']
            profile_picture = request.FILES.get('profile_picture')

            user = MyUser.objects.create_user(username, email=email, password=password)

            if profile_picture:
                user.profile_picture = profile_picture
                imageURL = user.profile_picture.url if user.profile_picture else None
                user.imageURL = imageURL

            # debug
            print("profile_picture : ", profile_picture)
    
            user.save()

            return Response({'message': "유저 생성 완료"}, status=status.HTTP_200_OK)
        else:
            return Response({'message': "유저 생성 실패"}, status=status.HTTP_400_BAD_REQUEST)

class Logout(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.is_authenticated:
            logout(request)
            return Response({'message' : "로그아웃 성공"}, status=status.HTTP_200_OK)
        else:
            return Response({'message' : "로그인이 되어 있지 않음"}, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def get(self, request):
        return Response(status=status.HTTP_200_OK)

class CheckLogin(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=301)

class UserImage(APIView):
    def get(self, request, filename):
        image_path = os.path.join('profile_pictures/', filename)
        with open(image_path, 'rb') as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type="image/jpeg")
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    UserSerializer,
)
    # FriendSerializer,
from .models import MyUser
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from ft_user.models import MyUser, Block
from ft_user.forms import signForm
from django.views.generic import View
from django.http import JsonResponse
import base64
import os
from django.http import HttpResponse
from django.core.files.storage import default_storage
from .utils import get_online_users #seycheon_online_status

# Create your views here.

class UserViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MyUser.objects.filter(user_id=self.request.user.user_id)

    def get(self, request):
        queryset = self.get_queryset()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)

class SelectUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = MyUser.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)

# class FriendView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, user_id):
#         from_user = request.user
#         to_user = get_object_or_404(MyUser, id=user_id)
#         serializer = FriendSerializer(data = {'from_user' : from_user, 'to_user' : to_user})
#         serializer.is_vaild(raise_exception=True)
#         friend_request = serializer.save()
#         return Response({"message" : "친구 신청을 보냈습니다"}, status = status.HTTP_201_CREATED)
    
# class FriendAcceptView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, friend_request_id):
#         friend_request = get_object_or_404(Friends, id=friend_request_id)
#         if friend_request.to_user != request.user:
#             return Response({'message' : "권한이 없습니다."}, status = status.HTTP_403_FORBIDDEN)
#         if friend_request.status != 'pending':
#             return Response({'message' : "이미 처리된 요청입니다."}, status = status.HTTP_400_BAD_REQUEST)

#         friend_request.status = 'accept'
#         friend_request.save()
#         from_user = friend_request.from_user
#         to_user = friend_request.to_user
#         from_user.friends.add(to_user)
#         return Response({'message' : "친구 요청을 수락했습니다."}, status = status.HTTP_200_OK)
    
# class FriendRejectView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, friend_request_id):
#         friend_request = get_object_or_404(Friends, id=friend_request_id)
#         if friend_request.to_user != request.user:
#             return Response({'message' : "권한이 없습니다."}, status = status.HTTP_403_FORBIDDEN)
#         if friend_request.status != 'pending':
#             return Response({'message' : "이미 처리된 요청입니다."}, status = status.HTTP_400_BAD_REQUEST)
        
#         friend_request.status = 'reject'
#         friend_request.save()

#         return Response({'message' : "친구 신청을 거절했습니다."}, status = status.HTTP_200_OK)
    
# class FriendDeleteView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request, friend_request_id):
#         friend_request = get_object_or_404(Friends, id=friend_request_id)
#         if friend_request.to_user != request.user:
#             return Response({'message' : "권한이 없습니다."}, status = status.HTTP_403_FORBIDDEN)
#         if friend_request.status != 'accept':
#             return Response({'message' : "친구가 아닙니다."}, status = status.HTTP_400_BAD_REQUEST)
#         friend_request.status = 'delete'
#         friend_request.save()
#         return Response({'message' : "친구를 삭제했습니다."}, status = status.HTTP_200_OK)

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
 
# class ProfileImageUploadView(View):
#     def post(self, request):
#         profile_picture = request.FILES.get('profile_picture')
#         if profile_picture:
#             filename = f"{request.user.id}_{profile_picture.name}"
#             file_path = os.path.join('profile_pictures', filename)
#             with open(file_path, 'wb+') as f:
#                 for chunk in profile_picture.chunks():
#                     f.write(chunk)
#             return JsonResponse({'filename': filename})
#         else:
#             return JsonResponse({'error': 'No image file provided'}, status=400)
        
class UserInfoChange(APIView):
    permission_classes = [IsAuthenticated]

    # def get_queryset(self):
    #     return MyUser.objects.filter(user_id=self.request.user.user_id)

    def post(self, request):
        user = request.user
        if user is not None:
            username = request.data.get('username')
            email = request.data.get('email')
            profile_picture = request.FILES.get('profile_picture')

            if username:
                if MyUser.objects.filter(username = username).exists():
                    return Response({'message': '이미 해당 유저네임이 존재합니다'}, status=status.HTTP_400_BAD_REQUEST)
                user.username = username

            if email:
                user.email = email

            if profile_picture:
                if user.profile_picture:
                    default_storage.delete(user.profile_picture.name)
                user.profile_picture = profile_picture

            user.save()
            return Response({'message': '유저 정보 변경 성공'}, status=status.HTTP_200_OK)
        else:
            return Response({'message': '유저 정보가 없습니다.'}, status=status.HTTP_400_BAD_REQUEST)

# #seycheon_block
# class UserBlockRequest(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         apply_user_id = request.data.get('apply_user')
#         accept_user_id = request.data.get('accept_user')

#         try:
#             apply_user = MyUser.objects.get(username=apply_user_id)
#             accept_user = MyUser.objects.get(username=accept_user_id)
#         except MyUser.DoesNotExist:
#             return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        
#         if apply_user.block_list.filter(username=accept_user_id).exists():
#             return Response({'message': 'User already in black list'}, status=status.HTTP_200_OK)
        
#         apply_user.block_list.add(accept_user)
#         return Response({'message': 'User added to black list'}, status=status.HTTP_200_OK)
    

# #seycheon_block
# class UserBlockReleaseRequest(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         apply_user_id = request.data.get('apply_user')
#         accept_user_id = request.data.get('accept_user')

#         try:
#             apply_user = MyUser.objects.get(username=apply_user_id)
#             accept_user = MyUser.objects.get(username=accept_user_id)
#         except MyUser.DoesNotExist:
#             return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        
#         if apply_user.block_list.filter(username=accept_user_id).exists():
#             apply_user.block_list.remove(accept_user)
            
#         return Response({'message': 'User added to black list'}, status=status.HTTP_200_OK)

# #seycheon_block
# class UserBlockCheckRequest(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         apply_user_id = request.data.get('apply_user')
#         accept_user_id = request.data.get('accept_user')

#         try:
#             apply_user = MyUser.objects.get(username=apply_user_id)
#             accept_user = MyUser.objects.get(username=accept_user_id)
#         except MyUser.DoesNotExist:
#             return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)

#         if apply_user.block_list.filter(username=accept_user_id).exists() or accept_user.block_list.filter(username=apply_user_id).exists():
#             return Response({'error': 'One of the users has blocked the other'}, status=301) # 400 or 404를 하면 콘솔창에 에러가 발생했다고 나와서 임시로 상태 바꿈

#         return Response({'message': 'Users are not blocking each other'}, status=status.HTTP_200_OK)

class UserBlockRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')

        try:
            apply_user = MyUser.objects.get(username=apply_user_id)
            accept_user = MyUser.objects.get(username=accept_user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        
        if Block.objects.filter(blocker=apply_user, blocked=accept_user).exists():
            return Response({'message': 'User already in block list'}, status=status.HTTP_200_OK)
        
        Block.objects.create(blocker=apply_user, blocked=accept_user)
        return Response({'message': 'User added to block list'}, status=status.HTTP_200_OK)

class UserBlockReleaseRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')

        try:
            apply_user = MyUser.objects.get(username=apply_user_id)
            accept_user = MyUser.objects.get(username=accept_user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)

        block_relationship = Block.objects.filter(blocker=apply_user, blocked=accept_user).first()
        
        if block_relationship:
            block_relationship.delete()
            return Response({'message': 'User removed from block list'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User not in block list'}, status=status.HTTP_400_BAD_REQUEST)

class UserBlockCheckRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')

        try:
            apply_user = MyUser.objects.get(username=apply_user_id)
            accept_user = MyUser.objects.get(username=accept_user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)

        if Block.objects.filter(blocker=apply_user, blocked=accept_user).exists() or Block.objects.filter(blocker=accept_user, blocked=apply_user).exists() :
            return Response({'error': 'One of the users has blocked the other'}, status=301) # 400 or 404를 하면 콘솔창에 에러가 발생했다고 나와서 임시로 상태 바꿈

        return Response({'message': 'Users are not blocking each other'}, status=status.HTTP_200_OK)

#seycheon_online_status
class GetUsersOnlineStatus(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        current_users = get_online_users()
        usernames = [user.username for user in current_users]
        return Response({'online_users': usernames})
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..serializer import UserSerializer
from ..utils import validate_input, validate_password, validate_email
from ..model import MyUser
from django.http import HttpResponse
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate, login, logout

class UserViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MyUser.MyUser.objects.filter(user_id=self.request.user.user_id)

    def get(self, request):
        queryset = self.get_queryset()
        serializer = UserSerializer.UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer.UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
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

class SelectUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = MyUser.MyUser.objects.all()
        serializer = UserSerializer.UserSerializer(queryset, many=True)
        return Response(serializer.data)
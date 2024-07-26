from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..utils import validate_input, validate_password, validate_email
from django.http import HttpResponse
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate, login, logout

class CheckLogin(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=301)
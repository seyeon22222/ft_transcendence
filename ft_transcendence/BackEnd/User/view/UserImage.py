from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..utils import validate_input, validate_password, validate_email
from django.http import HttpResponse
from django.core.files.storage import default_storage
from django.contrib.auth import authenticate, login, logout
import os

class UserImage(APIView):
    def get(self, request, filename):
        image_path = os.path.join('profile_pictures/', filename)
        with open(image_path, 'rb') as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type="image/jpeg")
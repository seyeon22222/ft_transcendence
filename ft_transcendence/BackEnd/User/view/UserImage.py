from rest_framework.views import APIView
from django.http import HttpResponse
import os

class UserImage(APIView):
    def get(self, request, filename):
        image_path = os.path.join('profile_pictures/', filename)
        with open(image_path, 'rb') as f:
            image_data = f.read()
        return HttpResponse(image_data, content_type="image/jpeg")
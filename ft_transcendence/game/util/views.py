from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.http import FileResponse
import os, json
# # Create your views here.

class shader_file(APIView):
     def get(self, request, filename):
        file_path = os.path.join(settings.BASE_DIR, 'static', 'shader', filename)
        try:
            with open(file_path, 'r') as file:
                content = file.read()
            return Response(content, status=status.HTTP_200_OK, content_type='text/plain')
        except FileNotFoundError:
            return Response("File not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class mesh_json(APIView):
    def get(self, request, filename):
        file_path = os.path.join(settings.BASE_DIR, 'static', 'mesh', filename)
        try:
            if (ord(filename[0]) >= 65 and ord(filename[0]) <= 90):
                with open(file_path, 'r', encoding='utf-8-sig') as file:
                    json_data = json.load(file)
            else:
                with open(file_path, 'r') as file:
                    json_data = json.load(file)
            return Response(json_data, status=status.HTTP_200_OK)
        except FileNotFoundError:
            return Response("File not found", status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class skybox_image(APIView):
    def get(self, request, filename):
        file_path = os.path.join(settings.BASE_DIR, 'static', 'skybox', filename)
        print(file_path)
        try:
            return FileResponse(open(file_path, 'rb'), content_type='image/png')
        except FileNotFoundError:
            return Response("File not found", status=status.HTTP_404_NOT_FOUND)
        
class texture_image(APIView):
    def get(self, request, filename):
        file_path = os.path.join(settings.BASE_DIR, 'static', 'texture', filename)
        print(file_path)
        try:
            return FileResponse(open(file_path, 'rb'), content_type='image/png')
        except FileNotFoundError:
            return Response("File not found", status=status.HTTP_404_NOT_FOUND)
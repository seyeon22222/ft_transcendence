from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from ..serializer import UserSerializer
from ..model import MyUser


class SelectUser(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = MyUser.MyUser.objects.all()
        serializer = UserSerializer.UserSerializer(queryset, many=True)
        return Response(serializer.data)
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotAuthenticated
from ..serializer import UserSerializer
from ..model import MyUser


class UserViewSet(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            user = MyUser.MyUser.objects.filter(user_id=self.request.user.user_id)
        except MyUser.MyUser.DoesNotExist as e:
            return e
        
        return user

    def get(self, request):
        try:
            queryset = self.get_queryset()
        except queryset == MyUser.MyUser.DoesNotExist:
            return Response({'error' : 'Initial Error'}, status=status.status_400_BAD_REQUEST)
        
        serializer = UserSerializer.UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserSerializer.UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    
    def handle_exception(self, exc):
        if isinstance(exc, NotAuthenticated):
            return Response(status=301)
        return super().handle_exception(exc)
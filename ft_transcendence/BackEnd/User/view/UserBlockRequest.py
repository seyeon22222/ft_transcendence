from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..model import MyUser

class UserBlockRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')

        try:
            apply_user = MyUser.MyUser.objects.get(username=apply_user_id)
            accept_user = MyUser.MyUser.objects.get(username=accept_user_id)
        except MyUser.MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        
        if MyUser.Block.objects.filter(blocker=apply_user, blocked=accept_user).exists():
            return Response({'message': 'User already in block list'}, status=301)
        
        MyUser.Block.objects.create(blocker=apply_user, blocked=accept_user)
        return Response({'message': 'User added to block list'}, status=status.HTTP_200_OK)
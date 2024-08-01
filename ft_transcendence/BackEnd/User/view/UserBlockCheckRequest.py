from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..model import MyUser

class UserBlockCheckRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')

        try:
            apply_user = MyUser.MyUser.objects.get(username=apply_user_id)
            accept_user = MyUser.MyUser.objects.get(username=accept_user_id)
        except MyUser.MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)

        if MyUser.Block.objects.filter(blocker=apply_user, blocked=accept_user).exists() or MyUser.Block.objects.filter(blocker=accept_user, blocked=apply_user).exists() :
            return Response({'error': 'One of the users has blocked the other'}, status=301) # 400 or 404를 하면 콘솔창에 에러가 발생했다고 나와서 임시로 상태 바꿈

        return Response({'message': 'Users are not blocking each other'}, status=status.HTTP_200_OK)
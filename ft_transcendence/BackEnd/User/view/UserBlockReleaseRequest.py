from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..model import MyUser

class UserBlockReleaseRequest(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')

        try:
            apply_user = MyUser.MyUser.objects.get(username=apply_user_id)
            accept_user = MyUser.MyUser.objects.get(username=accept_user_id)
        except MyUser.MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)

        block_relationship = MyUser.Block.objects.filter(blocker=apply_user, blocked=accept_user).first()
        
        if block_relationship:
            block_relationship.delete()
            return Response({'message': 'User removed from block list'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'User not in block list'}, status=301)
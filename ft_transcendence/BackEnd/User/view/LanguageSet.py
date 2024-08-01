from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from ..serializer import UserSerializer
from ..model import MyUser

class LanguageSet(APIView):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return MyUser.MyUser.objects.filter(user_id=self.request.user.user_id)

    def get(self, request):
        queryset = self.get_queryset()
        serializer = UserSerializer.UserSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        language = request.data.get('language')
        user = request.data.get('user_id')

        try:
            change_user = MyUser.MyUser.objects.get(user_id=user)
        except MyUser.MyUser.DoesNotExist:
            return Response({'error' : "Invaild User"}, status=status.HTTP_400_BAD_REQUEST)

        change_user.language = language
        change_user.save()

        return Response(status=status.HTTP_200_OK)
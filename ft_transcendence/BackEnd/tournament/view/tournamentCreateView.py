from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import tournament
from ..serializer import tournamentSerializer
from User.model.MyUser import MyUser
from User.utils import validate_input

class tournamentCreateView(APIView):

    def get(self, request):
        tournaments = tournament.tournament.objects.all()
        serializer = tournamentSerializer.tournamentSerializer(tournaments, many=True)
        return Response(serializer.data)

    def post(self, request):
        tournament_name = request.data.get('tournament_name')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        username = request.data.get('username')

        valid, message = validate_input(tournament_name)
        if not valid:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

        if not tournament_name or not start_date or not end_date or not username:
            return Response({'error': 'All fields must be provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            apply_user = MyUser.objects.get(username=username)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)

        if tournament.tournament.objects.filter(name=tournament_name).exists():
            return Response({'error': '중복된 방이 있습니다'}, status=status.HTTP_400_BAD_REQUEST)

        tournament_M = tournament.tournament.objects.create(
            name=tournament_name,
            start_date=start_date,
            end_date=end_date,
            is_active=True,
            operator = apply_user,
        )

        serializer = tournamentSerializer.tournamentSerializer(tournament_M)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
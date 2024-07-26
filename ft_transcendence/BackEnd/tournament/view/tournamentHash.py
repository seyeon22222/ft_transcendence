from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

class tournamentHash(APIView):
    def get(self, request, player1, player2, tournament_id):
        hash_url=''
        try :
            player1_id = player1
            player2_id = player2
            
            hash_url = f"{player1_id}_{player2_id}_{tournament_id}"
            return Response({'hash': hash_url}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error in matchGetHash: {e}")
            return Response({'error':'Internal Server Error'}, status=500)
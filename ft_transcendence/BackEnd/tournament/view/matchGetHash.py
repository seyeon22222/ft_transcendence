from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import Match
from django.shortcuts import get_object_or_404

class matchGetHash(APIView):
    def get(self, request, match_id):
        try :
            match = get_object_or_404(Match.Match, id=match_id)
            combined_string = f"{match.player1.user_id}_{match.player2.user_id}_{match_id}"

            return Response({'hash': combined_string}, status=status.HTTP_200_OK)
        except Match.Match.DoesNotExist:
            return Response({'error':'Match not found'}, status=404)
        except Exception as e:
            print(f"Error in matchGetHash: {e}")
            return Response({'error':'Internal Server Error'}, status=500)
        
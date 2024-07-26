from rest_framework import serializers
from ..model import MatchInfo

class MatchInfoSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = MatchInfo.MatchInfo
        fields = ['user', 'match_date', 'match_result']
from rest_framework import serializers
from django.db.models import Q
from .models import MyUser, GameStat, MatchInfo

class GameStatSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = GameStat
        fields = ['user', 'win_count', 'defeat_count', 'win_rate', 'reflect_rate']

class MatchInfoSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = MatchInfo
        fields = ['user', 'match_date', 'match_result']

# class FriendSerializer(serializers.ModelSerializer):
#     from_user = serializers.SlugRelatedField(
#         slug_field='username',
#         queryset = MyUser.objects.all(),
#     )
#     to_user = serializers.SlugRelatedField(
#         slug_field='username',
#         queryset = MyUser.objects.all(),
#     )
#     status = serializers.CharField(read_only=True)

#     class Meta:
#         model = Friends
#         fields = ['from_user', 'to_user', 'status']


#     def vaildate(self, data):
#         from_user = data['from_user']
#         to_user = data['to_user']

#         if from_user == to_user:
#             raise serializers.ValidationError("자기 자신에게 친구 신청할 수 없습니다.")
#         if from_user.friends.filter(id=to_user.id).exists():
#             raise serializers.ValidationError("이미 친구입니다.")
#         if from_user.sent_friend_requests.filter(to_user=to_user).exists():
#             raise serializers.ValidationError("이미 친구신청을 보냈습니다.")
#         if from_user.received_friend_requests.filter(from_user=to_user).exists():
#             raise serializers.ValidationError("상대방이 이미 친구신청을 보냈습니다.")
#         return data
    
#     def create(self, validated_data):
#         friend_request = Friends.objects.create(
#             from_user=validated_data['from_user'],
#             to_user=validated_data['to_user'],
#             status='pending'
#         )
#         return friend_request

class UserSerializer(serializers.ModelSerializer):
    game_stat = GameStatSerializer(many=True, read_only=True)
    match_info = MatchInfoSerializer(many=True, read_only=True)
    # friend = friend = serializers.SerializerMethodField()

    class Meta:
        model = MyUser
        fields = ['user_id','username', 'password', 'email', 'profile_picture', 'game_stat', 'match_info']

    # def get_friend(self, obj):
    #     friend_requests = Friends.objects.filter(
    #         Q(from_user=obj) | Q(to_user=obj),
    #         status='accept'
    #     )
    #     friends = set([fr.from_user for fr in friend_requests] + [fr.to_user for fr in friend_requests])
    #     serializer = FriendSerializer(instance=friends, many=True)
    #     return serializer.data
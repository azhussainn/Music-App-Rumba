from rest_framework import serializers
from .models import SpotifyToken, Vote


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpotifyToken
        fields = (
                'id', 'user', 'created_at',
                'refresh_token', 'access_token',
                'expires_in', 'token_type'
                )

class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = (
                'id','user', 'created_at', 'song_id', 'room'
                )
from django.shortcuts import render, redirect
from requests import Request, post
from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .credentials import CLIENT_ID, CLIENT_SECRET, REDIRECT_URI
from .utils import *
from api.models import Room
from .models import SpotifyToken, Vote
from .serializers import TokenSerializer, VoteSerializer
from requests import post, put, get

class AuthURL(APIView):
    def get(self, request, foramt=None):

        #We want the following things from spotify

        scopes= 'user-read-playback-state user-modify-playback-state user-read-currently-playing'

        #creating a url that can authorize our app
        #if successful, we will get a code in response

        url = Request('GET', 'https://accounts.spotify.com/authorize',
                        params={
                            'scope' : scopes,
                            'response_type' : 'code',
                            'redirect_uri': REDIRECT_URI,
                            'client_id' : CLIENT_ID
                        }).prepare().url

        return Response({'url':url}, status=status.HTTP_200_OK)

def spotify_callback(request, format=None):

    #taking code from the authorization request

    code = request.GET.get('code')
    error = request.GET.get('error')

    #sending post request to spotify to get back access token/refresh token
    #

    response = post('https://accounts.spotify.com/api/token', data={
                'grant_type': 'authorization_code',
                'code' : code,
                'redirect_uri': REDIRECT_URI,
                'client_id' : CLIENT_ID,
                'client_secret' : CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    refresh_token = response.get('refresh_token')
    expires_in = response.get('expires_in')
    error = response.get('error')

    if not request.session.exists(request.session.session_key):
        request.session.create()

    session_id = request.session.session_key

    #saving tokens in the database
    update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token)

    #redirecting to the frontend app
    return redirect('frontend:')


class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)

        return Response(
            {'status' : is_authenticated},
            status=status.HTTP_200_OK
            )

class ShowTokens(generics.ListAPIView):

    queryset = SpotifyToken.objects.all()
    serializer_class = TokenSerializer


class ShowVotes(generics.ListAPIView):

    queryset = Vote.objects.all()
    serializer_class = VoteSerializer


class DeleteTokens(APIView):
    def get(self, request, format=None):
        SpotifyToken.objects.all().delete()
        return Response({}, status=status.HTTP_200_OK)


class CurrentSong(APIView):
    def get(self, request, format=None):

        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({},
                status=status.HTTP_404_NOT_FOUND)

        host = room.host
        endpoint = 'https://api.spotify.com/v1/me/player/currently-playing'
        res = execute_spotify_api_request(host, endpoint)

        if 'error' in res or 'item' not in res:
            return Response({}, status=status.HTTP_204_NO_CONTENT)

        item = res.get('item')
        duration = item.get('duration_ms')
        progress = res.get('progress_ms')
        album_cover = item.get('album').get('images')[0].get('url')
        is_playing = res.get('is_playing')
        song_id = item.get('id')

        artist = item.get('artists')

        artists_string = ''
        for i, artistDic in enumerate(artist):
            if i > 0:
                artists_string += ', '
            name = artistDic['name']
            artists_string += name


        votes = len(Vote.objects.filter(room=room, song_id=song_id))
        votes_required = room.votes_to_skip

        song = {
            'title' : item.get('name'),
            'artist' : artists_string,
            'duration' : duration,
            'time' : progress,
            'is_playing' : is_playing,
            'votes' : votes,
            'votes_required' : votes_required,
            'id' : song_id,
            'image_url' : album_cover
        }
        self.update_room_song(room, song_id)

        return Response(song, status=status.HTTP_200_OK)

    def update_room_song(self, room, songId):
        current_Song = room.current_song

        #only update song in id, if we got a new song
        if current_Song != songId:
            room.current_song = songId
            room.save(update_fields=['current_song'])

            #reset all votes for a brand new song
            votes = Vote.objects.filter(room=room).delete()


class PauseSong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_403_FORBIDDEN)

        #song can only pe paused by host or by guest if allowed
        if self.request.session.session_key == room.host or room.guest_can_pause:
            pause_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)


class PlaySong(APIView):
    def put(self, request, format=None):
        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
        else:
            return Response({}, status=status.HTTP_403_FORBIDDEN)

        #song can only pe played by host or by guest if allowed
        if self.request.session.session_key == room.host or room.guest_can_pause:
            play_song(room.host)
            return Response({}, status=status.HTTP_204_NO_CONTENT)
        return Response({}, status=status.HTTP_403_FORBIDDEN)

class SkipSong(APIView):
    def post(self, request, format=None):

        room_code = self.request.session.get('room_code')
        room = Room.objects.filter(code=room_code)
        if room.exists():
            room = room[0]
            votes = Vote.objects.filter(room=room, song_id=room.current_song)
            votes_needed = room.votes_to_skip

        else:
            return Response({}, status=status.HTTP_403_FORBIDDEN)

        #if host or if votes needed tos kip song achieved
        if self.request.session.session_key == room.host or len(votes) + 1 >= votes_needed:

            #removing all previous votes
            votes.delete()

            skip_song(room.host)

        #add the current vote to the Vote db
        else:
            user= self.request.session.session_key
            vote = Vote(user=user, room=room, song_id=room.current_song)
            vote.save()

        return Response({}, status=status.HTTP_204_NO_CONTENT)
from django.utils import timezone
from .models import SpotifyToken
from datetime import timedelta
from requests import post, put, get
from rest_framework.response import Response
from rest_framework import status
from .credentials import CLIENT_ID, CLIENT_SECRET

BASE_URL = 'https://api/spotify.com/v1/me/'

def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):

    #checking if the user already has a token
    tokens = get_user_tokens(session_id)

    expires_in = timezone.now() + timedelta(seconds=expires_in)

    #updating the user token
    if tokens:
        tokens.access_token = access_token
        tokens.token_type = token_type
        tokens.expires_in = expires_in
        tokens.save(update_fields=['access_token', 'token_type', 'expires_in'])

    #creating a new user token
    else:
        tokens = SpotifyToken(
            user=session_id,
            access_token=access_token,
            refresh_token=refresh_token,
            token_type=token_type,
            expires_in=expires_in
        )
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)

    #checking if authenticated
    if tokens:

        #checking if the token has expired or not
        expiry = tokens.expires_in

        #if token has expired, get a new token
        if expiry <= timezone.now():
            refresh_spotify_token(tokens, session_id)

        return True

    return False


def refresh_spotify_token(tokens, sessionId):
    refresh_token = tokens.refresh_token


    #getting new token
    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token' :refresh_token,
        'client_id' : CLIENT_ID,
        'client_secret' : CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')


    update_or_create_user_tokens(sessionId, access_token, token_type, expires_in, refresh_token)


#to handle api request to spotify
def execute_spotify_api_request(session_id, endpoint, post_=False, put_=False):

    tokens = get_user_tokens(session_id)
    if tokens == None:
        return Response(
                {'not Found': 'Login with spotify'},
                status=status.HTTP_404_NOT_FOUND)

    access_token = tokens.access_token
    headers={
            'Content-Type':'application/json',
            'Authorization':f'Bearer {access_token}'
            }

    if post_:
        res = post(endpoint, headers=headers)
        print(res.json())

    if put_:
        res = put(endpoint, headers=headers)
        print(res.json())

    res = get(endpoint, {}, headers=headers)

    try:
        return res.json()
    except:
        return {'error': 'Issue with request'}


def play_song(session_id):
    endpoint = 'https://api.spotify.com/v1/me/player/play'
    return execute_spotify_api_request(session_id, endpoint, put_=True)


def pause_song(session_id):
    endpoint = 'https://api.spotify.com/v1/me/player/pause'
    return execute_spotify_api_request(session_id, endpoint, put_=True)


def skip_song(session_id):
    endpoint = 'https://api.spotify.com/v1/me/player/next'
    return execute_spotify_api_request(session_id, endpoint, post_=True)
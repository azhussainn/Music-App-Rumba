import React from 'react'
import MusicPlayerContainer from './MusicPlayerContainer'

const MusicPlayer = ({song}) => {

    const {image_url, title, artist, is_playing,
            time, duration, votes, votes_required } = song
    const songProgress = (time / duration) * 100

    const pauseSong = () => {
        const requestOptions = {
            method:'PUT',
            headers:{'Content-Type':'application/json'}
        }
        fetch('/spotify/pause', requestOptions)
    }

    const playSong = () => {
        const requestOptions = {
            method:'PUT',
            headers:{'Content-Type':'application/json'}
        }
        fetch('/spotify/play', requestOptions)
    }

    const skipSong = () => {
        const requestOptions={
            method:'POST',
            headers:{'Content-Type':'application/json'}
        }
        fetch('/spotify/skip', requestOptions)
    }

    return (
        <MusicPlayerContainer
            image_url={image_url}
            title={title}
            artist={artist}
            is_playing={is_playing}
            songProgress={songProgress}
            pauseSong={pauseSong}
            playSong={playSong}
            skipSong={skipSong}
            votes={votes}
            votes_required={votes_required}
        />
    )
}

MusicPlayer.defaultProps={
    song : {
        image_url : 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80',
        title : 'Song Not Loaded Yet',
        artist : 'Working On It....',
        is_playing : null,
        time : 0,
        duration : 1,
        votes : 0,
        votes_required : 0
    }
}


export default MusicPlayer
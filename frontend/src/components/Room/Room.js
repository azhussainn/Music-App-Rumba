import React, { useState, useEffect, useContext, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Grid, Button } from '@material-ui/core'
import { Context } from '../../Context'
import RoomPageContainer from './RoomPageContainer'
import Setting from '../Setting'

const Room = ({match}) => {

    const history = useHistory()
    const { removeRoomCode } = useContext(Context)

    const [ votesToSkip, setVotesToSkip] = useState(null)
    const [ guestCanPause, setGuestToPause ] = useState(null)
    const [ isHost, setIsHost ] = useState(null)
    const [didMount, setDidMount] = useState(false)
    const [ showSetting, setShowSetting ] = useState(false)
    const [ spotifyAuthenticated, setSpotifyAuthenticated ] = useState(false)
    const [ song, setSong ] = useState({})

    const roomCode =  match.params.roomCode
    const timer = useRef(null)

    const SettingsButton = () => (
        <Grid item xs={12} align='center'>
            <Button
                variant='contained'
                color='primary'
                onClick={(e) => {
                    showSetting ? setShowSetting(false) :
                    setShowSetting(true)
                }}
            >
                Settings
            </Button>
        </Grid>
    )

    const getRoomDetails = () => {
        fetch(`/api/get-room/?code=${roomCode}`)
            .then(res => {
                if(!res.ok){
                    history.push('/')
                }
                return res.json()
            })
            .then(data => {
                setVotesToSkip(data.votes_to_skip)
                setGuestToPause(data.guest_can_pause)
                setIsHost(data.is_host)
            })

            .catch((_err) => console.log("Failed"))
    }

    const leaveRoom = () => {

        const requestOptions={
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        }
        fetch('/api/leave-room', requestOptions)
            .then((_res) => {
                if(didMount){
                    removeRoomCode()
                }
                history.push('/')
            })
    }

    const authenticateSpotify = () => {
        fetch('/spotify/is-authenticated')
            .then(res => res.json())
            .then(data => {

                setSpotifyAuthenticated(data.status)

                //if this is a brand new user
                if(!data.status){
                    fetch('/spotify/get-auth-url')
                        .then(res => res.json())
                        .then(data => {

                            //we will get a url as data.url
                            //which we are calling to get the code
                            //needed to get the token for the user from spotify

                            window.location.replace(data.url)
                        })
                }
            })
    }

    const getCurrentSong = () => {
        fetch('/spotify/current-song')
            .then(res => {
                if(!res.ok){
                    return {}
                }else{
                    return res.json()
                }
            }).then(data => setSong(data))
    }

    useEffect(() => {
        setDidMount(true)
        getRoomDetails()

        if(isHost){
            authenticateSpotify()
        }

        timer.current = setInterval(getCurrentSong, 1000)

        return () => {
            setDidMount(false)
            clearInterval(timer.current)
        }
    }, [isHost])

        return(

                !showSetting ?
                < RoomPageContainer
                    roomCode={roomCode}
                    votesToSkip={votesToSkip}
                    guestCanPause={guestCanPause}
                    isHost={isHost}
                    SettingsButton={SettingsButton}
                    leaveRoom={leaveRoom}
                    song={song}
                />
                :
                <Setting
                    votesToSkip={votesToSkip}
                    guestCanPause={guestCanPause}
                    roomCode={roomCode}
                    showSettingsPage={setShowSetting}
                    updateRoom={getRoomDetails}
                />
        )
}

export default Room
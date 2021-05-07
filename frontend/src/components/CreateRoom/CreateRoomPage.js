import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import CreateRoomPageContainer from './CreateRoomPageContainer'

import {
    Button,
    Grid,
} from '@material-ui/core'


const CreateRoomPage = ({ votesToSkip, guestCanPause,
                        update, roomCode, updateCallback}) => {

    const history = useHistory()
    const [ guestCanPause_m, setGuestCanPause ] = useState(guestCanPause)
    const [ votesToSkip_m, setVotesToSkip ] = useState(votesToSkip)
    const [ successMsg, setSuccessMsg ] = useState(null)
    const [ errorMsg, setErrorMsg ] = useState(null)
    const [isMounted, setIsMounted ] = useState(false)

    const title = update ? "Update Room" : "Create a Room"

    const CreateRoomHandler = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip : votesToSkip_m,
                guest_can_pause : guestCanPause_m
            })
        }

        fetch('/api/create-room', requestOptions)
            .then(res => res.json())
            .then(data => {
                history.push(`/room/${data.code}`)
            })
            .catch(err => console.log('Failed'))
    }

    const UpdateRoomHandler = () => {

        const requestOptions = {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                votes_to_skip : votesToSkip_m,
                guest_can_pause : guestCanPause_m,
                code : roomCode

            })
        }

        fetch('/api/update-room', requestOptions)
            .then(res => {
                if(res.ok){
                    setErrorMsg(null)
                    setSuccessMsg('Room Updated Successfully')
                }else{
                    setSuccessMsg(null)
                    setErrorMsg("Error in Updating Room")
                }
                if(isMounted){
                    updateCallback()
                }
            })
            .catch(err => console.log('Failed'))
    }

    const createRoomButton = () =>(
        <>
            <Grid item xs={12} align="center">
                <Button
                    color='primary'
                    variant='contained'
                    onClick={CreateRoomHandler}
                >
                    Create A Room
                </Button>
            </Grid>

            <Grid item xs={12} align="center">
                <Button
                    color='secondary'
                    variant='contained'
                    component={Link}
                    to='/'
                >
                    Back
                </Button>
            </Grid>
        </>
        )

    const updateRoomButton = () => (
        <>
            <Grid item xs={12} align="center">
                <Button
                    color='primary'
                    variant='contained'
                    onClick={UpdateRoomHandler}
                >
                    Update Room
                </Button>
            </Grid>
        </>
    )

    useEffect(() => {
        setIsMounted(true)

        return () => setIsMounted(false)
    })

    return (
        <CreateRoomPageContainer
            errorMsg={errorMsg} successMsg={successMsg}
            setSuccessMsg={setSuccessMsg} title={title}
            guestCanPause_m={guestCanPause_m} setGuestCanPause={setGuestCanPause}
            votesToSkip_m={votesToSkip_m} setVotesToSkip={setVotesToSkip}
            update={update} updateRoomButton={updateRoomButton}
            createRoomButton={createRoomButton}
        />
    )
}

CreateRoomPage.defaultProps = {
    votesToSkip : 2,
    guestCanPause : true,
    update : false,
    roomCode : null,
    updateCallback : () => {}
}

export default CreateRoomPage
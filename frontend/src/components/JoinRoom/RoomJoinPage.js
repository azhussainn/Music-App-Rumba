import React, { useState } from 'react'
import {useHistory } from 'react-router-dom'

import RoomJoinPageContainer from './RoomJoinPageContainer'

const RoomJoinPage = () => {

    const history = useHistory()
    const [roomCode, setRoomCode] = useState("")
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage ] = useState("")
    const handleClick = () => {

        const requestOptions ={
            method : 'POST',
            headers : { 'Content-Type':"application/json" },
            body: JSON.stringify({
                code : roomCode
            })
        }

        fetch(`/api/join-room`, requestOptions)
            .then(res => {
                if(res.ok){
                    setErrorMessage("")
                    history.push(`/room/${roomCode}`)
                }else{
                    setError(true)
                    setErrorMessage("Room Not Found")
                }
            }).catch(err => console.log(err))
    }

    return(
    <RoomJoinPageContainer
        error={error}
        roomCode={roomCode}
        errorMessage={errorMessage}
        setRoomCode={setRoomCode}
        handleClick={handleClick}
    />)
}
export default RoomJoinPage
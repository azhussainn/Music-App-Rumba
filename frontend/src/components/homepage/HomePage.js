import React, { useContext } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Context } from '../../Context'

import RoomJoinPage from '../JoinRoom/RoomJoinPage'
import CreateRoomPage from '../CreateRoom/CreateRoomPage'
import HomePageContainer from './HomePageContainer'
import Room from '../Room/Room'


const HomePage = () => {

    const { roomCode } = useContext(Context)

    return (
    <div>
        <Switch>
            <Route exact path= '/'>
                {
                    roomCode ?
                    <Redirect
                        to={`/room/${roomCode}`}
                    />
                    :
                    <HomePageContainer />
                }
            </Route>

            <Route path='/join'>
                <RoomJoinPage />
            </Route>

            <Route path='/create'>
                <CreateRoomPage />
            </Route>

            <Route path='/room/:roomCode' 
                component={Room}
            />

        </Switch>
    </div>
)}

export default HomePage
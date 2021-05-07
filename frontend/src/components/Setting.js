import React from 'react'
import { Grid, Button } from '@material-ui/core'
import CreateRoomPage from './CreateRoom/CreateRoomPage'

const Setting = ({votesToSkip, guestCanPause, roomCode,
                 showSettingsPage, updateRoom}) => (
    <Grid container spacing={1}>
        <Grid item xs={12} align='center'>
            <CreateRoomPage
                update={true}
                votesToSkip={votesToSkip}
                guestCanPause={guestCanPause}
                roomCode={roomCode}
                updateCallback={updateRoom}
            />
        </Grid>

        <Grid item xs={12} align='center'>
        <Button
            variant='contained'
            color='secondary'
            onClick={() => showSettingsPage(false)}
        >
            Close
        </Button>
        </Grid>
    </Grid>
)

export default Setting
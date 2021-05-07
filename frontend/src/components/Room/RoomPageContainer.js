import React from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import MusicPlayer from '../MediaPlayer/MusicPlayer'

const RoomPageContainer = ({roomCode,isHost,
                    SettingsButton, leaveRoom,
                    song }) => (
        <Grid container spacing={1}>

        <Grid item xs={12} align='center'>
            <Typography variant='h4'
                component="h4"
            >
                Code : {roomCode}
            </Typography>
        </Grid>
        {
            Object.keys(song).length > 0 ?
            <MusicPlayer song={song}/> :
            <MusicPlayer />
        }
        {
            isHost &&
            SettingsButton()
        }
        <Grid item xs={12} align='center'>
            <Button
                variant='contained' 
                color='secondary'
                onClick={leaveRoom}
            >
                Leave Room
            </Button>
        </Grid>
    </Grid>
)

export default RoomPageContainer
import React from 'react'
import { Link } from 'react-router-dom'

import {
    Grid,
    TextField,
    Button,
    Typography

} from '@material-ui/core'

const RoomJoinPageContainer = ({error, roomCode, errorMessage, setRoomCode, handleClick}) => (
    <Grid container spacing={1}>

        <Grid item xs={12} align='center'>
            <Typography variant="h4"
                component="h4"
            >
                Join a Room
            </Typography>
        </Grid>

        <Grid item xs={12} align='center'>
            <TextField
                error={error}
                label="Code"
                placeholder="Enter a Room Code"
                value={ roomCode }
                helperText={ errorMessage }
                variant="outlined"
                onChange={(e) => setRoomCode(e.target.value)}
            />
        </Grid>

        <Grid item xs={12} align='center'>
            <Button
                variant='contained'
                color='primary'
                onClick={handleClick}
            >
                Enter Room
            </Button>
        </Grid>

        <Grid item xs={12} align='center'>
            <Button
                variant='contained'
                color='secondary'
                to='/'
                component={Link}
            >
                Back
            </Button>
        </Grid>

    </Grid>
)

export default RoomJoinPageContainer
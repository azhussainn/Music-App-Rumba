import React from 'react'

import {
    Grid,
    Typography,
    TextField,
    FormHelperText,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
    Collapse
} from '@material-ui/core'

import Alert from '@material-ui/lab/Alert'


const CreateRoomPageContainer = (
    {errorMsg, successMsg, setSuccessMsg, title, guestCanPause_m,
    setGuestCanPause, votesToSkip_m, setVotesToSkip, update,
    updateRoomButton, createRoomButton
    }
) => (

    <Grid container spacing={1}>

        <Grid item xs={12} align='center'>
            <Collapse
                in={ (errorMsg || successMsg) && true}
            >
                {
                    successMsg &&
                    <Alert
                        severity='success'
                        onClose={() => {
                            setSuccessMsg(null)
                        }}
                    >
                        {successMsg}
                    </Alert>
                }

                {
                    errorMsg &&
                    <Alert
                        severity='error'
                        onClose={() => {
                            setErrorMsg(null)
                        }}
                    >
                        {errorMsg}
                    </Alert>
                }
            </Collapse>
        </Grid>

        <Grid item xs={12} align='center'>
            <Typography component='h4' variant='h4'>
                {title}
            </Typography>
        </Grid>

        <Grid item xs={12} align="center">
            <FormControl component="fieldset">
                <FormHelperText>
                    <span align="center">Guest Control of Playback State</span>
                </FormHelperText>
                <RadioGroup
                    row
                    value={guestCanPause_m}
                    onChange={ () => {
                        guestCanPause_m ? setGuestCanPause(false) :
                        setGuestCanPause(true)
                    }}
                >
                    <FormControlLabel
                        value={true}
                        control={<Radio color="primary" />}
                        label="Play/Pause"
                        labelPlacement="bottom"
                    />
                    <FormControlLabel
                        value={false}
                        control={<Radio color="secondary" />}
                        label="No Control"
                        labelPlacement="bottom"
                    />
                </RadioGroup>
            </FormControl>
        </Grid>

        <Grid item xs={12} align="center">
            <FormControl>
                <TextField
                    required={true}
                    type='number'
                    value={votesToSkip_m}
                    inputProps={{
                        min : 1,
                        style : {textAlign:"center"}
                    }}
                    onChange={(e) => setVotesToSkip(e.target.value)}
                />
                <FormHelperText>
                    <span align='center'>
                        Votes Required to Skip Song
                    </span>
                </FormHelperText>
            </FormControl>
        </Grid>
        {
            update
                ?
            updateRoomButton()
                :
            createRoomButton()
        }
    </Grid>
)

export default CreateRoomPageContainer
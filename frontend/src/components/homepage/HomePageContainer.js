import React from 'react'
import { Link } from 'react-router-dom'
import {Grid, Button, Typography, ButtonGroup } from '@material-ui/core'


const HomePageContainer = () => (

    <Grid container spacing={3}>
        <Grid item xs={12} align='center'>
            <Typography variant='h3'
                compact='h3'
            >
                Rumba Music
            </Typography>
        </Grid>

        <Grid item xs={12} align='center'>
            <ButtonGroup
                variant='contained'
                color='primary'
            >
                <Button
                    color='primary'
                    to='/join'
                    component={ Link }
                >
                    Join a Room
                </Button>

                <Button
                    color='secondary'
                    to='/create'
                    component={ Link }
                >
                    Create a Room
                </Button>

            </ButtonGroup>
        </Grid>
    </Grid>
)


export default HomePageContainer
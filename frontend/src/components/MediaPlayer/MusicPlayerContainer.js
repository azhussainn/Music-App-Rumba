import React from 'react'

import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress
} from '@material-ui/core'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faForward } from '@fortawesome/free-solid-svg-icons'


const MusicPlayerContainer = ({image_url, title, artist, is_playing,
                    songProgress, pauseSong, playSong, skipSong,
                    votes, votes_required
                }) => (
    <Card>
        <Grid container alignItems='center'>
            <Grid item align='center' xs={4}>
                <img
                    src={image_url}
                    height='100%'
                    width='100%'
                />
            </Grid>
            <Grid item align='center' xs={8}>
                <Typography
                    component='h5'
                    variant='h5'
                >
                    {title}
                </Typography>

                <Typography
                    color='textSecondary'
                    variant='subtitle1'
                >
                    {artist}
                </Typography>

                <Typography
                    color='textSecondary'
                    variant='subtitle1'
                >
                    Votes : {votes}
                </Typography>

                <Typography
                    color='textSecondary'
                    variant='subtitle1'
                >
                    Votes Required To Skip: {votes_required}
                </Typography>

                <div>
                    {
                        is_playing ?
                        < IconButton
                            onClick={ () => {
                                is_playing ? pauseSong() :
                                playSong()
                            }}
                        >
                            <FontAwesomeIcon
                                icon={faPause}
                                size="lg"
                                className='buttons-music'
                            />
                        </IconButton>
                    :
                    <IconButton
                        onClick={() => {
                            is_playing ? pauseSong() :
                            playSong()
                        }}
                    >
                            <FontAwesomeIcon
                                icon={faPlay}
                                size="lg"
                                className='buttons-music'
                            />
                    </IconButton>
                    }
                </div>
                <IconButton
                 onClick={skipSong}
                >
                    <FontAwesomeIcon
                        icon={faForward}
                        size="lg"
                        className='buttons-music'
                    />
                </IconButton>

            </Grid>
        </Grid>
        <LinearProgress
            variant='determinate'
            value={songProgress}
        />
    </Card>
)

export default MusicPlayerContainer
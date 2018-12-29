import React from 'react';
import Grid from '@material-ui/core/Grid';
import ShootoutAttempt from './ShootoutAttempt';

const Shootout = ({ attempts, rounds }) => {

    let displayAttempts = [...attempts];

    for(let i = displayAttempts.length; i < rounds; i += 1){
        displayAttempts.push({
            player: 'N/A',
            result: 'pending'
        })
    }

    return (
        <Grid container spacing={16} justify='center'>
            {
                displayAttempts.map((attempt, i) => {
                    return <ShootoutAttempt key={i} attempt={attempt} />;
                })
            }
        </Grid>
    )
}


export default Shootout;
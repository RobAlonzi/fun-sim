import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

});

const generatePeriodTime = (time, total) => {

    const timeLeft = total - time;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

const Team = ({ classes, clock }) => {
    return (
        <Grid container alignItems='center' justify='center'>
            <Grid item>
                <Grid container direction='column' alignItems='center'>
                    <Grid item>
                        <Typography variant='h2'>{generatePeriodTime(clock.time, clock.period.totalTime)}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle1'>{ clock.period.name }</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}


export default withStyles(styles)(Team);
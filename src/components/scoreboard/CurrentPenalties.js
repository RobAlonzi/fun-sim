import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    bold: {
        fontWeight: 'bold'
    }
});

const generatePeriodTime = (time, total) => {

    const timeLeft = total - time;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

const currentPenalties = ({ classes, penalties, team, isHome }) => {
    if(!penalties.length){
        return null;
    }
    return (
        <Grid container alignItems='center' justify='center'>
            <Grid item>
                <Grid container direction='column' alignItems='center'>
                    <Grid item>
                        <Typography variant='body2'>
                            PENALTY
                        </Typography>
                    </Grid>
                    {penalties.map(penalty => {
                        return (
                            <Grid item>
                                <Typography>
                                    <span class={classes.bold}>
                                        { !isHome && `${generatePeriodTime(0, penalty.remaining)} - `}
                                    </span>
                                    {` ${penalty.player} (${penalty.penalty}) `}
                                    <span class={classes.bold}>
                                        { isHome && `- ${generatePeriodTime(0, penalty.remaining)}`}
                                    </span>
                                </Typography>
                            </Grid>
                        );
                    })}
                </Grid>
            </Grid>
        </Grid>
    );
}


export default withStyles(styles)(currentPenalties);
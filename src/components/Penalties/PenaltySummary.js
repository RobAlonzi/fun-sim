import React from 'react';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { generateTeamImg } from '@/util/Teams';

const styles = theme => ({
    avatar: {
        margin: 15,
        width: 40,
        height: 40,
        borderRadius: 'initial'
    },
    bold: {
        fontWeight: 'bold'
    },  
    withMargin: {
        marginRight: 5
    }
});

const generatePenaltyTime = params => {
    const minutes = Math.floor(params.time / 60);
    const seconds = params.time % 60;

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds} / ${params.period}`;
}

const PenaltySummary = ({ classes, penalty, players }) => {
    
    const player = players[penalty.data.player];
    
    return (
        <Grid style={{ margin: '20px 0' }} container alignItems="center">
            <Grid item>
                <Avatar className={classes.avatar} src={generateTeamImg(player.team)} />
            </Grid>
            <Grid item style={{ flexGrow: 1}}>
                <Grid container direction='column'>
                    <Grid item>
                        <Typography variant="subtitle2">{player.name}</Typography>
                    </Grid>
                    <Grid style={{ margin: '0 0 10px'}} item>
                        <Grid container>
                            <Typography variant='caption'>
                                { penalty.data.description }
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container style={{ border: '1px solid #DDD'}}>
                    <Grid xs item style={{ padding:5 }}>
                        <Grid container justify='center'>
                            <Typography variant='caption'>{generatePenaltyTime(penalty.time)}</Typography>
                        </Grid>
                    </Grid>
                    <Grid xs item style={{ padding:5, background: '#DDD'}}>
                        <Grid container justify='center'>
                            <Typography variant='caption'>{penalty.data.type} - {penalty.data.penalty}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default withStyles(styles)(PenaltySummary);
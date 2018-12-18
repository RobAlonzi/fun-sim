import React from 'react';
import Grid from '@material-ui/core/Grid';
import classnames from 'classnames';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import { generateTeamImg } from '@/util/Teams';

const styles = theme => ({
    avatar: {
        margin: 15,
        width: 60,
        height: 60,
        borderRadius: 'initial'
    },
    bold: {
        fontWeight: 'bold'
    },  
    withMargin: {
        marginRight: 5
    }
});

const generateGoalTime = params => {
    const minutes = Math.floor(params.time / 60);
    const seconds = params.time % 60;

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds} / ${params.period}`;
}

const GoalSummary = ({ classes, goal, players }) => {

    const player = players[goal.data.player.id];

    return (
        <Grid style={{ margin: '10px 0' }} container alignItems="center">
            <Grid item>
                <Avatar className={classes.avatar} src={generateTeamImg(goal.data.team)} />
            </Grid>
            <Grid item style={{ flexGrow: 1}}>
                <Grid container direction='column'>
                    <Grid item>
                        <Typography variant="h6">{player.name} ({goal.data.player.total})</Typography>
                    </Grid>
                    <Grid style={{ margin: '0 0 10px'}} item>
                        <Grid container>
                            { goal.data.assists.map((assist, index, arr) => {
                                const player = players[assist.id];
                                return (
                                    <Typography variant='caption' className={classnames({[classes.withMargin]: arr.length - 1 !== index})} key={player.id}>
                                        { `${player.name} (${assist.total}) ${arr.length - 1 !== index ? ',' : ''}` }
                                    </Typography>
                                );
                            })}
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Grid container style={{ border: '1px solid #DDD'}}>
                            <Grid xs item style={{ padding:5 }}>
                                <Grid container justify='center'>
                                    <Typography variant='caption'>{generateGoalTime(goal.time)}</Typography>
                                </Grid>
                            </Grid>
                            <Grid xs item style={{ padding:5, background: '#DDD'}}>
                                <Grid container justify='center'>
                                    { Object.keys(goal.data.score).map((key, index, arr) => (
                                        <Typography 
                                            variant='caption' 
                                            className={classnames({[classes.bold]: key === goal.data.team, [classes.withMargin]: arr.length - 1 !== index})} 
                                            key={key}
                                        >
                                            {`${key.toUpperCase()} ${goal.data.score[key]}${arr.length - 1 !== index ? ',' : ''}`}
                                        </Typography>
                                    ))}
                                </Grid>
                            </Grid>
                            { goal.data.variant !== 'EV' &&
                                <Grid item style={{ padding:5 }}>
                                    <Typography variant='caption' className={classes.bold}>
                                            {goal.data.variant}
                                    </Typography>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default withStyles(styles)(GoalSummary);
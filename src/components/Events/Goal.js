import React from 'react';
import classnames from 'classnames';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = () => ({
    bold: {
        fontWeight: 'bold'
    }
});

const Goal = ({ classes, data, time, players, teams }) => {

    const goalScorer = players[data.result.player.id];
    const team = teams[data.result.team];
    const deflectPlayer = data.deflect && players[data.player];

    return (
        <Base name="Goal" time={time}>
            <Typography>
                <span class={classes.bold}>{team.name}</span>
                {' goal scored by '}
                <span class={classes.bold}>{goalScorer.name}</span>
                { deflectPlayer &&
                    <React.Fragment>
                        {' by deflecting a shot from '}
                        <span class={classes.bold}>{deflectPlayer.name}</span>
                    </React.Fragment> 
                }
                {'.'}
                { data.result.assists.length === 0 ?
                    ' The goal was unnassisted.' :
                    <React.Fragment>
                    {' The goal was assisted by '}
                    { data.result.assists.map((assist, index, arr) => {
                        const player = players[assist.id];
                        return (
                            <React.Fragment>
                            <span class={classes.bold}>{player.name}</span>
                            { arr.length - 1 === index ? '.' : ' and ' }
                            </React.Fragment>
                        )
                    })}
                    </React.Fragment>
                }
                
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(Goal);


       {/* <Grid style={{ margin: '10px 0' }} container alignItems="center">
            <Grid item style={{ flexGrow: 1}}>
                <Grid container direction='column'>
                    <Grid item>
                        <Typography variant="h6">{goalScorer.name} ({data.result.player.total})</Typography>
                    </Grid>
                    <Grid style={{ margin: '0 0 10px'}} item>
                        <Grid container>
                            { data.result.assists.map((assist, index, arr) => {
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
                            <Grid xs item style={{ padding:5, background: '#DDD'}}>
                                <Grid container justify='center'>
                                    { Object.keys(data.result.score).map((key, index, arr) => (
                                        <Typography 
                                            variant='caption' 
                                            className={classnames({[classes.bold]: key === data.result.team, [classes.withMargin]: arr.length - 1 !== index})} 
                                            key={key}
                                        >
                                            {`${key.toUpperCase()} ${data.result.score[key]}${arr.length - 1 !== index ? ',' : ''}`}
                                        </Typography>
                                    ))}
                                </Grid>
                            </Grid>
                            { data.result.variant !== 'EV' &&
                                <Grid item style={{ padding:5 }}>
                                    <Typography variant='caption' className={classes.bold}>
                                            {data.result.variant}
                                    </Typography>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            </Grid> */}
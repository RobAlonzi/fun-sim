import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import get from 'lodash.get';

import CurrentPenalties from './CurrentPenalties';
import Shootout from './Shootout';

const styles = theme => ({

});

const generatePeriodTime = (time, total) => {

    const timeLeft = total - time;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
}

const Team = ({ classes, clock, homeTeam, visitingTeam, penalties, shootout }) => {
    const visitingPenalties = penalties.filter(penalty => penalty.team === visitingTeam.key);
    const homePenalties = penalties.filter(penalty => penalty.team === homeTeam.key);
    const showTime = clock.period.key !== 'final' && clock.period.key !== 'shootout';
    const isShootout = clock.period.key === 'shootout' || clock.period.isShootout;

    const homeShootout = get(shootout, [homeTeam.key], []);
    const visitingShootout = get(shootout, [visitingTeam.key], []);

    return (
        <Grid container alignItems='center' justify='center'>
            <Grid item xs style={{ alignSelf: !showTime ? 'center' : 'flex-start' }}>
                <Grid container direction='column' alignItems='center'>
                    { showTime && (
                        <Grid item>
                            <Typography variant='h2'>{generatePeriodTime(clock.time, clock.period.totalTime)}</Typography>
                        </Grid>
                    )}
                    <Grid item>
                        <Typography variant={!showTime ? 'h4' : 'subtitle1'}>{ clock.period.name }</Typography>
                    </Grid>
                    <Grid item xs style={{ width: '100%', margin: '20px 0' }}>
                        <Grid container alignItems='center' spacing={16}>
                            { isShootout ? 
                            <React.Fragment>
                                <Grid item style={{minWidth: '50%'}}>
                                    <Shootout
                                        attempts={visitingShootout}
                                        rounds={Math.max(Math.ceil((homeShootout.length + visitingShootout.length) / 2), 3)}
                                    />
                                </Grid>
                                <Grid item style={{minWidth: '50%'}}>
                                    <Shootout
                                        attempts={homeShootout}
                                        rounds={Math.max(Math.ceil((homeShootout.length + visitingShootout.length) / 2), 3)}
                                    />
                                </Grid>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Grid item style={{minWidth: '50%'}}>
                                    <CurrentPenalties penalties={visitingPenalties} team={visitingTeam} /> 
                                </Grid>
                                <Grid item style={{minWidth: '50%'}}>
                                    <CurrentPenalties penalties={homePenalties} team={homeTeam} isHome />
                                </Grid>
                            </React.Fragment>
                            }
                            
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}


export default withStyles(styles)(Team);
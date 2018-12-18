import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = () => ({
    bold: {
        fontWeight: 'bold'
    }
});

const ShotSaved = ({ classes, data, time, players, teams }) => {

    const shooter = players[data.player];
    const team = teams[shooter.team];
    const blocker = players[data.result.player];
    const blockerTeam = teams[blocker.team];

    const deflectPlayer = data.deflect && players[data.deflect.player];

    return (
        <Base name="Shot Blocked" time={time}>
            <Typography>
                <span class={classes.bold}>{team.key.toUpperCase()}</span>
                {' shot by '}
                <span class={classes.bold}>{shooter.name}</span>
                { deflectPlayer &&
                    <React.Fragment>
                        {' is deflected by '}
                        <span class={classes.bold}>{deflectPlayer.name}</span>
                    </React.Fragment> 
                }
                {`${deflectPlayer ? ' and' : ''} is blocked by `}
                <span class={classes.bold}>{`${blocker.name} (${blockerTeam.key.toUpperCase()}).`}</span>
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(ShotSaved);
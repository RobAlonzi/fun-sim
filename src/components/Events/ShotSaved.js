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
    const goalie = players[data.result.player];
    const goalieTeam = teams[goalie.team];

    const deflectPlayer = data.deflect && players[data.deflect.player];

    return (
        <Base name="Shot Saved" time={time}>
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
                {`${deflectPlayer ? ' and' : ''} is saved by `}
                <span class={classes.bold}>{`${goalie.name} (${goalieTeam.key.toUpperCase()}) `}</span>
                {`with${data.result.isRebound ? '' : 'out'} a rebound.`}
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(ShotSaved);
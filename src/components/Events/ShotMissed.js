import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = () => ({
    bold: {
        fontWeight: 'bold'
    }
});

const ShotMissed = ({ classes, data, time, players, teams }) => {

    const shooter = players[data.player];
    const team = teams[shooter.team];

    const deflectPlayer = data.deflect && players[data.deflect.player];

    return (
        <Base name="Shot Missed" time={time}>
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
                {`${deflectPlayer ? ' and' : ''} has missed the net.`}
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(ShotMissed);
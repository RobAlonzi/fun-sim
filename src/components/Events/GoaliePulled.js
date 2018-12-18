import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = theme => ({
    bold: {
        fontWeight: 'bold'
    }
});

const GoalieReturned = ({ classes, data, time, players, teams }) => {

    const player = players[data.player];
    const team = teams[player.team];

    return (
        <Base name="Goalie Pulled" time={time}>
            <Typography>
                The <span class={classes.bold}>{`${team.name}`}</span> have pulled <span class={classes.bold}>{`${player.name}`}</span> to bring on an extra attacker.
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(GoalieReturned);
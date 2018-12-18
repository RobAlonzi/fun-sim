import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = theme => ({
    bold: {
        fontWeight: 'bold'
    }
});

const Penalty = ({ classes, data, time, players, teams }) => {

    const player = players[data.player];
    const team = teams[player.team];

    const { type, penalty } = data;

    return (
        <Base name="Penalty" time={time}>
            <Typography>
                <span class={classes.bold}>{`${type} penalty`}</span>{' to '}
                <span class={classes.bold}>{`${player.name}`}</span>{' of the '}
                <span class={classes.bold}>{`${team.name}`}</span>{' for '}
                <span class={classes.bold}>{`${penalty}`}</span>.
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(Penalty);
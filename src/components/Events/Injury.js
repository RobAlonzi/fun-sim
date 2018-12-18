import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = theme => ({
    bold: {
        fontWeight: 'bold'
    }
});

const Injury = ({ classes, data, time, players, teams }) => {

    const player = players[data.player];
    const team = teams[player.team];
    const injury = data.injury;

    return (
        <Base name="Injury" time={time}>
            <Typography>
                <span class={classes.bold}>{`${player.name}`}</span> of the <span class={classes.bold}>{`${team.name}`}</span> has injured his <span class={classes.bold}>{`${injury}`}</span>.
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(Injury);
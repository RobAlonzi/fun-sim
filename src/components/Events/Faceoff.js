import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = theme => ({
    bold: {
        fontWeight: 'bold'
    }
});

const Faceoff = ({ classes, data, time, players }) => {

    const winner = players[data.winner];
    const loser = players[data.loser];
    const zone = data.location;

    return (
        <Base name="Faceoff" time={time}>
            <Typography>
                <span class={classes.bold}>{`${winner.name}`}</span> wins face-off versus <span class={classes.bold}>{`${loser.name}`}</span> in the <span class={classes.bold}>{`${zone}`}</span>
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(Faceoff);
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = theme => ({
    bold: {
        fontWeight: 'bold'
    }
});

const Icing = ({ classes, data, time, players }) => {

    const player = players[data.player];

    return (
        <Base name="Icing" time={time}>
            <Typography>
                Icing by <span class={classes.bold}>{`${player.name}`}</span>
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(Icing);
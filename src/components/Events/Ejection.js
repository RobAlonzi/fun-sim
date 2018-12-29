import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = theme => ({
    bold: {
        fontWeight: 'bold'
    }
});

const Ejection = ({ classes, data, time, players }) => {

    const teamKey = players[data.player].team;
    const description = data.description.replace(' is ejected ', ` (${teamKey.toUpperCase()}) is ejected `)

    return (
        <Base name="Ejection" time={time}>
            <Typography>
                { description }
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(Ejection);
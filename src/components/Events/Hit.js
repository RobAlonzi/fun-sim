import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = theme => ({
    bold: {
        fontWeight: 'bold'
    }
});

const Hit = ({ classes, data, time, players }) => {

    const winner = players[data.winner];
    const loser = players[data.loser];
    const turnover = data.turnover;

    return (
        <Base name="Hit" time={time}>
            <Typography>
                <span class={classes.bold}>{`${winner.name}`}</span> hits <span class={classes.bold}>{`${loser.name}`}</span> { turnover && 'and causes a turnover'}
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(Hit);
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = theme => ({
    bold: {
        fontWeight: 'bold'
    }
});

const Fight = ({ classes, data, time, players }) => {
    return (
        <Base name="Fight" time={time}>
            <Typography>
                { data.description }
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(Fight);
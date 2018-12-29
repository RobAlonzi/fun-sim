import React from 'react';
import Grid from '@material-ui/core/Grid';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

const ShootoutAttempt = ({ attempt }) => {
    return (
        <Grid item style={{ margin: '0 5px' }}>
            { attempt.result === 'goal' && <CheckCircleIcon style={{ color: 'green' }} /> }
            { attempt.result === 'miss' && <CancelIcon style={{ color: 'red' }} />}
            { attempt.result === 'pending' && <CheckBoxOutlineBlankIcon />}
        </Grid>
    );
}


export default ShootoutAttempt;
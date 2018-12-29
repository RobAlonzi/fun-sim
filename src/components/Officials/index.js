import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const Officials = ({ officials }) => {
    return (
        <Paper elevation={0} square>
            <Grid container direction='column'>
                <Grid item><Typography>Referees: {officials.referees.join(' and ')}</Typography></Grid>
                <Grid item><Typography>Linesmen: {officials.linesman.join(' and ')}</Typography></Grid>
            </Grid>
        </Paper>
    )
}

export default Officials;
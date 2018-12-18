import React from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';


const GameDate = ({ date }) => {
    return (
        <Paper style={{ padding: '10px 20px 0'}} elevation={0} square>
            <Grid container justify='flex-start'>
                <Grid item><Typography>{date}</Typography></Grid>
            </Grid>
        </Paper>
    )
}

export default GameDate;
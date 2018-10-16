import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({

});

const Team = ({ classes }) => {
    return (
        <Grid container alignItems='center' justify='center'>
            <Grid item>
                <Grid container direction='column' alignItems='center'>
                    <Grid item>
                        <Typography variant='h2'>20:00</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle1'>1st Period</Typography>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}


export default withStyles(styles)(Team);
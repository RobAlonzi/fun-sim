import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import { generateTeamImg } from '@/util/Teams';

const styles = theme => ({
    avatar: {
        margin: 15,
        width: 40,
        height: 40,
        borderRadius: 'initial'
    },
    card:{
        boxShadow: 'none'
    },
    bold: {
        fontWeight: 'bold'
    },  
    withMargin: {
        marginRight: 5
    }
});

const generateTime = params => {
    const minutes = Math.floor(params.time / 60);
    const seconds = params.time % 60;

    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds} / ${params.period}`;
}

const GoalSummary = ({ classes, children, name, time }) => {
    return (
        <Card className={classes.card}>
            <CardContent>
                <Grid container alignItems="center" style={{ marginBottom: 30 }}>
                    <Grid item style={{ padding: '5px 20px', marginRight: 20, border: '1px solid #DDD'}}>
                        {name}
                    </Grid>
                    <Grid item xs>
                        {children}
                    </Grid>
                    { time && 
                        <Grid item style={{ padding:'5px 20px', background: '#DDD'}}>
                            <Typography variant='caption'>{generateTime(time)}</Typography>
                        </Grid>
                    }
                    { false &&
                        <Grid item style={{ padding:5 }}>
                            <Typography variant='caption' className={classes.bold}>
                                LOGO
                            </Typography>
                        </Grid>
                    }
                </Grid>
                <Divider />
            </CardContent>
        </Card>
    )
}


export default withStyles(styles)(GoalSummary);
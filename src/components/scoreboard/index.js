import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Team from './Team';
import Scoreclock from './Scoreclock';


const styles = theme => ({
    container: {
        background: '#FFF',
        display: 'flex',
        justifyContent: 'space-around'
    }
})


const Scoreboard = ({ clock, homeTeam, visitingTeam, penalties, shootout, classes }) => {    
    return (
        <Paper className={classes.container} elevation={0}>
            <Team team={visitingTeam} />
            <Scoreclock clock={clock} penalties={penalties} homeTeam={homeTeam} visitingTeam={visitingTeam} shootout={shootout} />
            <Team team={homeTeam} isHome={true} />
        </Paper>
    )
}

export default withStyles(styles)(Scoreboard);

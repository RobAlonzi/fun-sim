import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import PeriodSummary from './PeriodSummary';

const styles = theme => ({

});

const ScoringPlays = ({ goals, players }) => {
    return (
        <Paper style={{ padding: 10}} elevation={0} square>
            <Typography variant="h5">Scoring Summary</Typography>
            
            { Object.keys(goals).map((period, index) => {
                return (
                    <PeriodSummary key={index} title={period.replace(/([A-Z])/g, ' $1').trim()} goals={goals[period]} players={players} />
                )
            }) }
        </Paper>
    )
}

export default withStyles(styles)(ScoringPlays);
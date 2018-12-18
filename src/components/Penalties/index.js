import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import PenaltySummary from './PenaltySummary';

const styles = theme => ({

});

const ScoringPlays = ({ penalties, players }) => {
    return (
        <Paper style={{ padding: 10, marginTop: 40}} elevation={0} square>
            <Typography variant="h5">Penalty Summary</Typography>
            
            { penalties.map((penalty, index) => {
                return (
                    <PenaltySummary key={index} penalty={penalty} players={players} />
                )
            }) }
        </Paper>
    )
}

export default withStyles(styles)(ScoringPlays);
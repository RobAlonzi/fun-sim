import React from 'react';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import GoalSummary from './GoalSummary';

const styles = theme => ({

});

const PeriodScoring = ({ title, goals, players }) => {
    return (
        <div style={{ padding: 10}}>
            <Typography style={{ background: '#DDD', padding: '0 10px'}} variant="subtitle1">{title}</Typography>
            {goals.map((goal, index, arr) => (
                <React.Fragment>
                    <GoalSummary key={index} goal={goal} players={players}/>

                    { index !== arr.length - 1 && 
                        <Divider />
                    }
                </React.Fragment>    
            ))}
        </div>
    )
}


export default withStyles(styles)(PeriodScoring);
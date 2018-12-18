import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import Base from './Base';

const styles = () => ({
    bold: {
        fontWeight: 'bold'
    }
});

const PenaltyShot = ({ classes, data, time, players, teams }) => {

    const shooter = players[data.player];
    const team = teams[shooter.team];
    const goalie = players[data.result.player];
    const goalieTeam = teams[goalie.team];
    const result = data.result;

    return (
        <Base name={data.isShootoutAttempt ? 'Shootout Attempt' : 'Penalty Shot'} time={null}>
            <Typography>
                <span class={classes.bold}>{team.key.toUpperCase()}</span>
                {data.isShootoutAttempt ? ' Shootout Attempt by ' : ' Penalty Shot by '}
                <span class={classes.bold}>{shooter.name}</span>
                {'.....'}
                { result.type === 'shotSaved' ? 
                    'SAVED!'
                :
                    'GOAL!'
                }
                {/* <span class={classes.bold}>{`${goalie.name} (${goalieTeam.key.toUpperCase()}) `}</span>
                {`with${data.result.isRebound ? '' : 'out'} a rebound.`} */}
            </Typography>
        </Base>
    );
}


export default withStyles(styles)(PenaltyShot);
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    logoContainer: {
        margin: '20px 0'
    },
    nameContainer: {
        margin: '20px 40px'
    }
});

const renderTeamScore = (score, classes) => (
    <Grid item>
        <Typography variant='h1'>{score}</Typography>
    </Grid>
)

const renderTeamLogo = (id, name, classes) => {
    const img = `https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${id}-dark.svg`

    return (
        <Grid item className={classes.logoContainer}>
            <img className='scoreboard-logo' src={img} alt={`${name} logo`} />
        </Grid>
    );
};

const Team = ({ classes, team: { id, key, name, stats }, isHome }) => {

    return (
        <Grid container alignItems='center' justify='center'>
            {isHome ? renderTeamScore(stats.final.goals.total, classes) : renderTeamLogo(id, name, classes)}
            <Grid item className={classes.nameContainer}>
                <Grid container direction='column' alignItems='center'>
                    <Grid item>
                        <Typography variant='h2'>{key.toUpperCase()}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant='subtitle1'>SOG: {stats.final.shots.total}</Typography>
                    </Grid>
                </Grid>
            </Grid>
            {isHome ? renderTeamLogo(id, name, classes) : renderTeamScore(stats.final.goals.total, classes)}
        </Grid>
    );
}


export default withStyles(styles)(Team);
import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    container:{
        padding: '10px 40px'
    },
    title: {
        margin: '10px 0 20px'
    },
    row: {
        margin: '10px 0'
    },
    meter:{
        height: 10,
        borderRadius:25,
        padding: 5,
        width:'50%',
        margin: '0 5px',
        display: 'inline-block',

        '& span':{
            display: 'block',
            height: '100%',
            borderRadius: 5
        }
    }
});

const generateMeter = (teamStat, opponentStat) => {
    let width = '100%';

    if(opponentStat > teamStat){
        width = `${teamStat / opponentStat * 100}%`;
    }

    return <span style={{ background:'red', width: width}} />
}

const generateTeamImg = id => {
    const img = `https://www-league.nhlstatic.com/builds/site-core/8d679dc125a67f8bf52f63a8cb3e70be14f173e9_1491511772/images/logos/team/current/team-${id}-dark.svg`;
    return <img style={{ width: 35, height: 35 }} src={img} />
}

const TeamStat = ({ classes, title, homeTeam, visitingTeam, statAppend }) => {
    return (
        <Grid className={classes.container} container direction="column">
            <Grid className={classes.title} item xs>
                <Typography variant="subtitle1">{title}</Typography>
            </Grid>
            <Grid item>
                <Grid container alignItems="center">
                    <Grid item xs>
                        {generateTeamImg(visitingTeam.id)}
                    </Grid>
                    <Grid item xs={10}>
                        <Grid container alignItems="center">
                            <div className={classes.meter}>{ generateMeter(visitingTeam.stat, homeTeam.stat ) }</div>
                            <Typography variant="h6">{visitingTeam.stat}{statAppend && statAppend}</Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container alignItems="center">
                    <Grid item xs>
                        {generateTeamImg(homeTeam.id)}
                    </Grid>
                    <Grid item xs={10}>
                        <Grid container alignItems="center">
                            <div className={classes.meter}>{ generateMeter(homeTeam.stat, visitingTeam.stat) }</div>
                            <Typography variant="h6">{homeTeam.stat}{statAppend && statAppend}</Typography>
                        </Grid>    
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}


export default withStyles(styles)(TeamStat);
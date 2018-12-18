import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withStyles } from '@material-ui/core/styles';


import Scoreboard from '@/components/scoreboard';
import GameDate from '@/components/GameDate';
import Officials from '@/components/Officials';
import ScoringPlays from '@/components/ScoringPlays';
import Penalties from '@/components/Penalties';
import GameInfo from '@/components/GameInfo';
import Events from '@/components/Events';
import PlayerStats from '@/components/PlayerStats';
import TeamStats from '@/components/TeamStats';

const styles = theme => ({
    tab: {
        padding: '40px 0'
    }
});


class App extends Component {

    state = { tabValue: 0 }

    componentDidMount() {
        //START THE GAME HERE
        this.props.startGame();
    }

    handleTabChange = (event, value) => this.setState(() => ({ tabValue: value }));

    render() {
        const { classes } = this.props;
        const { teams, players, game, clock, goals, penalties, events } = this.props.state;
        const homeTeam = teams[teams.home];
        const visitingTeam = teams[teams.visitor];

        return (
            <div className="main-app-container">
                <GameDate date={game.date} />
                <Scoreboard clock={clock} homeTeam={homeTeam} visitingTeam={visitingTeam} />
                <Officials officials={game.officials} />
                
                <Tabs className={classes.tab} value={this.state.tabValue} onChange={this.handleTabChange} centered>
                    <Tab label="LIVE" />
                    <Tab label="BOXSCORE" />
                </Tabs>

                <Grid container spacing={40} justify="space-between">
                    <Grid item lg={3}>
                        <ScoringPlays goals={goals} players={players} />
                        <Penalties penalties={penalties} players={players} />
                        
                    </Grid>

                    <Grid item lg={6}>
                        {this.state.tabValue === 0
                            ?
                            <Events data={events} players={players} teams={teams}/>
                            :
                            <PlayerStats homeTeam={homeTeam} visitingTeam={visitingTeam} players={players} />
                        }
                    </Grid>

                    <Grid item lg={3}>
                        <TeamStats homeTeam={homeTeam} visitingTeam={visitingTeam} />
                        <GameInfo info={game} />
                    </Grid>
                </Grid> 
            </div>
        )
    }
}



export default withStyles(styles)(App);
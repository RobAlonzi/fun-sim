import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import StatsTable from './StatsTable';

const styles = theme => ({
    tab:{
        padding:'20px 0'
    }
});

class PlayerStats extends Component {
    state = {
        tabValue: 0
    }

    handleTabChange = (event, value) => this.setState(() => ({ tabValue: value }));

    render() {
        const { classes, isFinal, players, homeTeam, visitingTeam } = this.props;
        return (
            <Paper>
                <Tabs className={classes.tab} value={this.state.tabValue} onChange={this.handleTabChange} centered>
                    <Tab label={homeTeam.name} />
                    <Tab label={visitingTeam.name} />
                </Tabs>

                <Grid container>
                    <Grid style={{padding: 20}} item xs>
                        {this.state.tabValue === 0 ?
                            <StatsTable team={homeTeam} players={players} isFinal={isFinal} />
                        :
                            <StatsTable team={visitingTeam} players={players} isFinal={isFinal} />
                        }
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}


export default withStyles(styles)(PlayerStats);
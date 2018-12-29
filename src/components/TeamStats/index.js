import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

import TeamStat from './TeamStat';

const styles = theme => ({

});

class TeamStats extends Component {
    render() {
        const { homeTeam, visitingTeam } = this.props;
        return (
            <Paper>
                <TeamStat 
                    title="Shots on Goal" 
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.shots.total }}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.shots.total }}
                />
                <Divider />
                <TeamStat 
                    title="Hits" 
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.hits }}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.hits }}
                />
                <Divider />
                <TeamStat 
                    title="Penalty Minutes" 
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.pims }}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.pims }}
                />
                <Divider />
                <TeamStat 
                    title="Faceoff Wins" 
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.faceoffWins }}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.faceoffWins }}
                />
                <Divider />
                <TeamStat 
                    title="Blocked Shots" 
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.blockedShots }}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.blockedShots }}
                />
            </Paper>
        )
    }
}


export default withStyles(styles)(TeamStats);
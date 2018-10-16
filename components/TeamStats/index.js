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
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.final.shots.total }}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.final.shots.total }}
                />
                <Divider />
                <TeamStat 
                    title="Hits" 
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.final.hits }}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.final.hits }}
                />
                <Divider />
                <TeamStat 
                    title="Penalty Minutes" 
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.final.pims }}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.final.pims }}
                />
                <Divider />
                <TeamStat 
                    title="Faceoff Wins" 
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.final.faceoffWins }}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.final.faceoffWins }}
                />
                <Divider />
                <TeamStat 
                    title="Blocked Shots" 
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.final.blockedShots }}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.final.blockedShots }}
                />
                <Divider />
                <TeamStat 
                    title="Powerplay (%)" 
                    homeTeam={{ id: homeTeam.id, stat: homeTeam.stats.final.powerplay.pct}}
                    visitingTeam={{ id: visitingTeam.id, stat: visitingTeam.stats.final.powerplay.pct }}
                    statAppend="%"
                />
            </Paper>
        )
    }
}


export default withStyles(styles)(TeamStats);
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';

import Faceoff from './Faceoff';
import Hit from './Hit';
import Shot from './Shot';
import Penalty from './Penalty';
import PenaltyShot from './PenaltyShot';
import Icing from './Icing';
import Offside from './Offside';
import Injury from './Injury';
import GoalieReplaced from './GoalieReplaced';
import GoalieReturned from './GoalieReturned';
import GoaliePulled from './GoaliePulled';

const Event = ({ event: { data, time }, players, teams }) => {
    let Component = null;

    switch(data.event){
        case 'faceoff':
            Component = Faceoff;
            break;
        case 'hit':
            Component = Hit;
            break;
        case 'icing':
            Component = Icing;
            break;
        case 'offside':
            Component = Offside;
            break;
        case 'goalieReplaced':
            Component = GoalieReplaced;
            break;    
        case 'goaliePulled':
            Component = GoaliePulled;
            break;       
        case 'goalieReturned':
            Component = GoalieReturned;
            break;
        case 'injury':
            Component = Injury;
            break;       
        // TODO
        case 'shot':
            Component = Shot;
            break;
        case 'penalty':
            Component = Penalty;
            break;
        case 'penaltyShot':
            Component = PenaltyShot;
            break;   
        default:
            debugger;    
    }

    if(Component){
        return (
            <Component data={data} time={time} players={players} teams={teams} />
        )
    }

    return null;
}

class Events extends Component {
    render() {
        const { data, players, teams } = this.props;
        return (
            <Paper>
                { data.map((event, index) => <Event key={index} event={event} players={players} teams={teams} />)}
            </Paper>
        )
    }
}


export default Events;
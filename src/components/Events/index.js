import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Pagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';

import Ejection from './Ejection';
import Faceoff from './Faceoff';
import Fight from './Fight';
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
        case 'ejected':
            Component = Ejection;
            break;
        case 'faceoff':
            Component = Faceoff;
            break;
        case 'fight':
            Component = Fight;
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

    state = {
        page: 0,
        rowsPerPage: 25,
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    }
    
    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    }

    render() {
        const { data, players, teams } = this.props;
        const { rowsPerPage, page } = this.state;
        return (
            <React.Fragment>
                <Paper>
                    <Typography variant="h5" style={{ padding: 15 }}> Latest Events </Typography>
                    <Pagination
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{ 'aria-label': 'Previous Page' }}
                        nextIconButtonProps={{ 'aria-label': 'Next Page' }}
                        rowsPerPageOptions={[25, 50, 75]}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                    { 
                        data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((event, index) => <Event key={index} event={event} players={players} teams={teams} />)
                    }
                </Paper>

                
            </React.Fragment>    
        )
    }
}


export default Events;
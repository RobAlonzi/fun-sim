import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

class Plays extends Component {
    render() {
        const { data } = this.props;
        return (
            <Paper>
                { data.map((events, index) => {
                    return (
                        <div key={index}>
                            <Typography>{events.event}--{JSON.stringify(events.result)}</Typography>
                            <Divider/>
                        </div>
                    )
                })}
            </Paper>
        )
    }
}


export default withStyles({})(Plays);
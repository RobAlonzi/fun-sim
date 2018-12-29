import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import { Subscribe } from 'unstated';

import GameContainer from '@/containers/GameContainer';

const styles = theme => ({
    icon: {
        display: 'none',
    },
    select: {
        paddingRight: 0,
    },
    selectMenu: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '0.80rem',
    }
})

class Header extends Component{

    state = {
        open: false,
    }

    handleOpen = () => {
        this.setState({ open: true });
    };
    
    handleClose = () => {
        this.setState({ open: false });
    };

    render(){
        return (
            <Subscribe to={[GameContainer]}>
                {props => (
                    <Grid container style={{ padding: '0 40px', marginTop: 10 }} justify='flex-end'>
                        {/* <IconButton onClick={() => props.pauseGame(!props.state.settings.isPaused)}>
                            { !props.state.settings.isPaused && <PauseCircleOutlineIcon /> }
                            { props.state.settings.isPaused && <PlayCircleOutlineIcon /> }
                        </IconButton> */}
                        <Typography style={{ marginRight: 10, alignSelf: 'center' }} variant="caption">Speed: </Typography>
                        <Select
                            disableUnderline
                            value={props.state.settings.gameSpeed}
                            onChange={event => props.updateGameSpeed(event.target.value)}
                            classes={{
                                select: this.props.classes.select,
                                selectMenu: this.props.classes.selectMenu,
                                icon: this.props.classes.icon
                            }}
                        >
                            <MenuItem value={2}>2s</MenuItem>
                            <MenuItem value={5}>5s</MenuItem>
                            <MenuItem value={10}>10s</MenuItem>
                            <MenuItem value={30}>30s</MenuItem>
                            <MenuItem value={60}>1m</MenuItem>
                        </Select>
                    </Grid>
                )}
            </Subscribe>
        )
    }
}


export default withStyles(styles)(Header);
import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';

import { mapData } from 'util/dataParsing';

class FetchData extends Component {
    state = {
        loading: true,
        data: {}
    }
    
    componentDidMount() {
        const { season, gameId } = this.props.match.params;

        const isPlayoffs = season.includes('Playoffs');

        // TODO.. get based on URL
        axios.get(`http://othl.ca/File/${season}/OTHL-${isPlayoffs ? 'PLF-' : ''}${gameId}.html`).then(response => {
            const data = mapData(response.data);
            this.setState(() => ({ loading: false, data, seasonType: isPlayoffs ? 'playoffs' : 'regular' }));
        });
    }

    render(){
        return (this.props.children(this.state))
    }
}


export default withRouter(FetchData);


//http://othl.ca/File/2017-RegularSeason/OTHL-938.html < --- General Fight
//http://othl.ca/File/2017-RegularSeason/OTHL-101.html < --- Goalie switch and injuries, video replay
//http://othl.ca/File/2017-RegularSeason/OTHL-220.html <--- Video replay.. no goal
//http://othl.ca/File/2017-RegularSeason/OTHL-211.html <--- Player with ' in name
//http://othl.ca/File/2017-RegularSeason/OTHL-222.html <-- No goal one period AND goalie assist
//http://othl.ca/File/2017-RegularSeason/OTHL-226.html <-- SH goal
//http://othl.ca/File/2017-RegularSeason/OTHL-246.html <-- Empty net
//http://othl.ca/File/2017-RegularSeason/OTHL-260.html <-- Shootout
//http://othl.ca/File/2017-Playoffs/OTHL-PLF-41.html <-- Playoff double OT
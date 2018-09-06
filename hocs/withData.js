import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router';

import { mapData } from 'util/dataParsing';


const withData = (WrappedComponent, options = {}) => {
  const HOC = class extends Component {

    constructor(props){
        super(props);

        this.state = {
            isLoading: true,
            data: {}
        }
    }

    //http://othl.ca/File/2017-RegularSeason/OTHL-938.html < --- General Fight
    //http://othl.ca/File/2017-RegularSeason/OTHL-101.html < --- Goalie switch and injuries, video replay
    //http://othl.ca/File/2017-RegularSeason/OTHL-220.html <--- Video replay.. no goal
    //http://othl.ca/File/2017-RegularSeason/OTHL-211.html <--- Player with ' in name
    //http://othl.ca/File/2017-RegularSeason/OTHL-222.html <-- No goal one period AND goalie assist
    //http://othl.ca/File/2017-RegularSeason/OTHL-226.html <-- SH goal
    //http://othl.ca/File/2017-RegularSeason/OTHL-246.html <-- Empty net
    //http://othl.ca/File/2017-RegularSeason/OTHL-260.html <-- Shootout

    componentDidMount() {
      // TODO.. get based on URL
      axios.get('http://othl.ca/File/2017-RegularSeason/OTHL-222.html').then(response => {
        const data = mapData(response.data);
      });

        setTimeout(() => { this.setState(() => ({ isLoading: false })) }, 3000);
    }

    render() {
      return this.state.isLoading ? <div>LOADING!!!</div> : <WrappedComponent {...this.props} />
    }
  };

  return withRouter(HOC);
};

export default withData;
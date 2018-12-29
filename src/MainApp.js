import React from 'react';
import { Provider, Subscribe } from 'unstated';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import GameContainer from '@/containers/GameContainer';

import FetchData from '@/containers/FetchData';
import Loading from '@/containers/Loading';

import App from '@/components/App';
import Header from '@/components/Header';
import Footer from '@/components/Footer';


import '@/styles/app.scss';
import appTheme from './themes/';
const theme = createMuiTheme(appTheme);

const Body = () => {
    return (
        <Subscribe to={[GameContainer]}>
            {props => (<App {...props} />)}
        </Subscribe>
)}


const RenderApp = () => (
    <FetchData>
    {({loading, data}) => {
        const Game = new GameContainer({ loading, data });
        return (
            <Provider inject={[Game]}>
                <Header />
                    <Loading loading={loading}>
                        <Body />
                    </Loading>    
                <Footer />
            </Provider>
        );
    }}
    </FetchData>
);


const MainApp = () => (
    <Router basename={CONFIG.basepath}>
        <MuiThemeProvider theme={theme}>
            <Route path='/:season/:gameId' component={RenderApp} />
        </MuiThemeProvider>
    </Router>
);

export default MainApp;
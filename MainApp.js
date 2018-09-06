import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import App from 'components/App';
import Header from 'components/Header';
import Footer from 'components/Footer';

import darkTheme from './themes/darkTheme';
const theme = createMuiTheme(darkTheme);

const RenderApp = () => (
    <div className="app-main">
        <Header />
        <App />
        <Footer />
    </div>
);


const MainApp = () => (
    <Router>
        <MuiThemeProvider theme={theme}>
            <Route path='*' component={RenderApp} />
        </MuiThemeProvider>
    </Router>
);

export default MainApp;
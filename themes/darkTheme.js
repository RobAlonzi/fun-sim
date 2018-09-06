import grey from 'material-ui/colors/grey';
import { white, black } from '@material-ui/core/colors/common'

export default {
    overrides: {
        MuiList:{
            root:{
                background: "#000"
            }
        },
        MuiPaper:{
            root: {
                borderRadius: 6
            }
        },
        MuiMenuItem: {
            root: {
                fontSize: '12px',
                color: '#98a0a6',
                fontWeight: 100,
                '&:hover':{
                    color: '#57e7fb',
                },
                '&$selected': {
                    color: '#57e7fb',
                    backgroundColor: '#000',
                },
          },
        },
    },
    palette: {
        type: 'dark',
        primary: white,
        secondary: black,
        background: {
            paper: '#15191c'
        }
    },
    status: {
        danger: 'orange',
    },
    typography: {
        fontFamily: ['Montserrat', 'sans-serif'].join(','),
        button: {
            fontWeight: 400,
            textAlign: 'capitalize'
        },
    },
};

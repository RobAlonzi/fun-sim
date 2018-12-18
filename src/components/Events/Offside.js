import React from 'react';
import Typography from '@material-ui/core/Typography';

import Base from './Base';

const Offside = ({ time }) => {
    return (
        <Base name="Offside" time={time}>
            <Typography>
                Offside.
            </Typography>
        </Base>
    );
}


export default Offside;
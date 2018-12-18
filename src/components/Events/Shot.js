import React from 'react';

import Goal from './Goal';
import ShotMissed from './ShotMissed';
import ShotSaved from './ShotSaved';
import ShotBlocked from './ShotBlocked';
import ShotHitPost from './ShotHitPost';

const Shot = props => {
    switch(props.data.result.type){
        case 'goal':
            return <Goal {...props} />;
        case 'shotBlocked':
            return <ShotBlocked {...props} />;
        case 'shotHitPost':
            return <ShotHitPost {...props} />;    
        case 'shotMissed':
            return <ShotMissed {...props} />;
        case 'shotSaved':
            return <ShotSaved {...props} />    
        default:
            debugger;
            return null;    
    }
}


export default Shot;
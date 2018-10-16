import React from 'react';

const Loading = ({ loading, children }) => {
    return ( 
        <React.Fragment>
            { loading ? <div>LOADING!!!!!</div> :  children }
        </React.Fragment>
)}

export default Loading
import {useHistory} from 'react-router-dom';
import React from 'react';

const GoHome =()=>{
    let history = useHistory();
    return(<>{history.push('/')}</>)
}

export default GoHome;
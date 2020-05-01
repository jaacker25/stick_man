import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import GoHome from './pages/GoHome';


const Router=()=>{
    return(
        <BrowserRouter>
            <Switch>
                <Route exact path="/" component={Home}/>
                <Route component={GoHome}/>
            </Switch>
        </BrowserRouter>
    )
}

export default Router;
import React from "react";
import {BrowserRouter,Route,Redirect} from "react-router-dom";
import loadable from "@loadable/component";

const InLoadable=loader=>(
    loadable(loader)
)

const Router=()=>{
    return (
        <BrowserRouter>
            <Route exact path="/" name="index" render={()=>(<Redirect to="home"></Redirect>)}></Route>
            <Route path="/home" name="home" component={InLoadable(()=>import("_pages/Home"))}></Route>
            <Route path="/trainlist" name="trainlist" component={InLoadable(()=>import("_pages/Trainlist"))}></Route>
        </BrowserRouter>
    );
}

export default Router;
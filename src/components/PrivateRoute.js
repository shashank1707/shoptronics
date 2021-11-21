import React from 'react'
import {Redirect, Route} from 'react-router-dom'

function PrivateRoute({component: Component, ...rest}) {
    return (
        <Route {...rest} component = {(props)=>{
            const uid = window.localStorage.getItem('uid');
            if(uid){
                return <Component {...props} />;
            }else{
                return <Redirect to={'/signin'} />
            }
        }}/>

    )
}

export default PrivateRoute

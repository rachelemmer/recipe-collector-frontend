import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import Home from './Home'
import AddToRecipeBook from './AddToRecipeBook'
import RecipeBook from './RecipeBook'
import RecipeNotes from './RecipeNotes'

export default function PrivateRoute(props) {
    return <Route {...props} render = {(routerProps) => {
        return localStorage.token ? <Home user={props.user} {...routerProps} />  
        : <Redirect to='/signup'/>
    }} />
}
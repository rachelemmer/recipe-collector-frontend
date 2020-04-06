import React from 'react'
import '../Styling/SignUp.css'
import LoginForm from './loginForm'
import {Link, Redirect} from 'react-router-dom'

export default class signUp extends React.Component{
    
    // goToLogin = () => {
    //    if (this.props.isUser === true) 
    //    {return this.props.history.push('/login')} 
    // }
    
    render() {
        return(
            <div className='mainBody'>
                <div className='signup'> 
                    <h1>Welcome to Recipe Collector</h1>
                    <h1>Sign-up</h1>
                    <LoginForm {...this.props} login={this.props.createUser}/> 
                    <Link to='/login' id='loginLink'>Already have an account? Login here</Link>
                    {this.props.isUser? <h2>Welcome! Please Login!</h2> : null}
                    {this.props.isCreatedUser? <h2>Could not register account, please try again</h2> :null}
                    {/* {this.goToLogin()} */}
                </div>
            </div>
        )
    }
}
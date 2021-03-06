import React from 'react';
import './App.css';
import SignUp from './Components/SignUp'
import {Route, Switch, Redirect} from 'react-router-dom'
import Login from './Components/Login'
import PrivateRoute from './Components/PrivateRoute';
import Home from './Components/Home'
import RecipeBook from './Components/RecipeBook'
import RecipeNotes from './Components/RecipeNotes'
import AddToRecipeBook from './Components/AddToRecipeBook'

class App extends React.Component {
  
  state= {
    user: [],
    isUser: false,
    isCreatedUser: false,
    isLoggedIn: false,
    isCorrectUser: true,
    isPasswordShort: false,
    isRecipeCreated: false,
    recipes: []
  }

  createUser = (user) => {
    fetch("https://recipe-collector-capstone.herokuapp.com/users", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: user.username, password: user.password})
    }).then(response => {
      if (response.status === 201) 
      {
        this.setState({isUser: true})
      } 
      if (response.status === 401) 
      {this.setState({isCreatedUser: true})}
      if (response.status === 406)
      {this.setState({isPasswordShort: true})}
    })
  }
    


  componentDidMount() {
    console.log('mount')
    if(localStorage.token){
      fetch(`https://recipe-collector-capstone.herokuapp.com/users/authenticate`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.token}`
      }
      })
      .then(response => response.json())
      .then(result => this.setState({user: result.user}))
    }
    if(localStorage.token){
    fetch(`https://recipe-collector-capstone.herokuapp.com/recipes/${localStorage.user_id}`, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${localStorage.token}`
      }
      })
        .then(response => response.json())
        .then(recipesObject => {
            this.setState({recipes: recipesObject.recipes})
        })
    }
  }

  login = (user) => {
   fetch("https://recipe-collector-capstone.herokuapp.com/users/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: user.username, password: user.password})
    })
    .then(response => response.json())
    .then(response => {
      if(response.status == 401)
      { this.setState({isCorrectUser: false}) }
     else {
      localStorage.setItem('token', response.token)
      localStorage.setItem('user_id', response.foundUser.id)
      this.componentDidMount()
      this.setState({isLoggedIn: true, user: response.foundUser})}
     })
  }

  addRecipe = (recipe) => {
    console.log('recipe', recipe)
    
    fetch('https://recipe-collector-capstone.herokuapp.com/recipes', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({title: recipe.title, 
        category: recipe.category, description: recipe.description, url: recipe.url, image: recipe.image, user_id: recipe.user_id}
      )
    })
    .then(response => {
      if (response.status == 201){
        this.setState({isRecipeCreated: true})
      }
    })
  }

  deleteRecipe = (id) => {
    fetch(`https://recipe-collector-capstone.herokuapp.com/recipes/delete/${id}`, {
    method: 'DELETE'
    }).then(response => response.json())
    .then(response => {
      if (response.status == 200){
        const recipes = this.state.recipes.filter(recipe => recipe.id !== id)
        this.setState({recipes: recipes})
      }
    })
    
}


  render() {

    return (
      <div className="App">
        <Switch> 
          <PrivateRoute exact user={this.state.user} path='/' />
          <Route path='/signup' render={(props) => <SignUp {...props} 
            isUser={this.state.isUser} isPasswordShort = {this.state.isPasswordShort} 
            isCreatedUser={this.state.isCreatedUser} createUser={this.createUser}/>}
          /> 
          <Route path='/login' render={(props)=> <Login {...props} 
            isLoggedIn={this.state.isLoggedIn} isCorrectUser={this.state.isCorrectUser} login={this.login} />}
          />
          <Route path='/book' render={(props) => <RecipeBook recipes={this.state.recipes} 
            user={this.state.user} {...props} deleteRecipe={this.deleteRecipe}/>}
          />  
          <Route path='/notes' render={(props) => <RecipeNotes user={this.state.user} {...props} />}/>  
          <Route path='/add' render={(props) => <AddToRecipeBook addRecipe={this.addRecipe} componentDidMount={this.componentDidMount}
            user={this.state.user} isRecipeCreated={this.state.isRecipeCreated} {...props} />}
          />  
          <Route render={() => <Redirect to='/signup'/>}/>
        </Switch>
      
      </div>
    );
  }
}


export default App;

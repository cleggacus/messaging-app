import React from 'react';
import './style.scss';
import {Redirect} from 'react-router-dom';

interface IState{
  redirect: string
}

class Entry extends React.Component<{}, IState>{
  constructor(props: Readonly<{}>){
    super(props);
    this.state = {
      redirect: ''
    }
  }

  redirect(loc: string){
    this.setState({
      redirect: loc
    })
  }

  renderRedirect(){
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }
  }
  
  render(){
    return(
      <div className="entry">
        {this.renderRedirect()}
        
        <div className="option-login" onClick={() => this.redirect("/login")}>
          <h1>Login</h1>
        </div>
        
        <div className="option-register" onClick={() => this.redirect("/register")}>
          <h1>Register</h1>
        </div>
      </div>
    );
  }
}

export default Entry;
import React from 'react';
import './style.scss';
import auth from '../auth';

import {BrowserRouter,Switch,Route,Redirect} from 'react-router-dom';

import {Theme, Themes, setTheme} from '../themes';
import MainApp from './mainApp';
import Login from './entry/login';
import Register from './entry/register';
import Entry from './entry';

interface IState{
  theme: Theme
}

class App extends React.Component<{}, IState>{
  constructor(props: any){
    super(props);

    let theme = this.getQueryVariable('theme');
    
    this.state = {
      theme: theme == "light" ? Themes.light : theme == "black" ? Themes.black : Themes.dark
    }
  }
  
  getQueryVariable(v: string){
    const vars = window.location.search.substring(1).split("&");

    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if(pair[0] == v){return pair[1];}
    }

    return false;
  }

  render(){
    setTheme(this.state.theme);
    return( 
      <div id="app">
        <BrowserRouter>
          <Switch>
            <Route exact path="/entry" component={Entry} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route path="/" component={auth(MainApp)} />
          </Switch>
        </BrowserRouter>
      </div>
    )
  }
}

export default App;
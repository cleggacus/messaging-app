import React from 'react';
import './style.scss';
import axios from 'axios';
import {Switch,Route,Redirect} from 'react-router-dom';
import {Menu as MenuIcon} from 'react-feather';

import {Theme, Themes, setTheme} from '../../themes';

import Message from './routes/message';
import Search from './routes/search';
import Account from './routes/account';
import Dash from './routes/dash';
import Navbar from './navbar';

interface IState{
  theme: Theme,
  username: string,
  redirect: string,
  picture: string,
  editAccountIsOpen: boolean
}

class MainApp extends React.Component<{}, IState>{
  constructor(props: any){
    super(props);

    this.state = {
      theme: Themes.light,
      username: '',
      redirect: '',
      picture: 'default',
      editAccountIsOpen: false
    }

    this.getMyInfo();
  }

  logout(){
    axios.get('/api/user/logout').then(res => {
      if(res.status == 200){
        window.location.reload();
      }
    })
  }

  toggleTheme(){
    const isDark = this.state.theme === Themes.dark;
    const isLight = this.state.theme === Themes.light;
    
    axios.post('/api/user/updateTheme', {theme: isDark ? 2 : isLight ? 1 : 0}).then(res => {
      if(res.status == 200){
        this.setState({
          theme: isDark ? Themes.black : isLight ? Themes.dark : Themes.light
        });
      }
    }).catch(err => {
      window.location.reload();
    })
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

  getMyInfo(){
    axios.get('/api/user/getUserInfo').then(res => {
      if(res.status == 200){
        switch(res.data.theme){
          case 0:
            this.setState({
              theme: Themes.light
            });
            break;
          case 1:
            this.setState({
              theme: Themes.dark
            });
            break;
          case 2:
            this.setState({
              theme: Themes.black
            });
            break;
          default:
            this.setState({
              theme: Themes.light
            });
        }

        this.setState({
          username: res.data.username,
          picture: res.data.picture
        });
      }else{
        window.location.reload();
      }
    }).catch(err => {
      window.location.reload();
    })
  }

  toggleMenu(){
    let navbar: any = document.querySelector('#navbar');
    navbar.classList.toggle("nav-open");
  }
  
  render(){
    setTheme(this.state.theme);

    return(
      <div className="mainApp">
        {this.renderRedirect()}
        <Navbar app={this} ></Navbar>
        
        <div id="content">
          <MenuIcon onClick={() => this.toggleMenu()}  color="var(--primary-fg)" id="mobileNavBtn"/>

          <Switch>
            <Route exact path="/"><Redirect to={`/dash`} /></Route>
            <Route exact path="/dash" component={Dash}></Route>
            <Route exact path="/message" component={Message} />
            <Route exact path="/search"><Search username={this.state.username} /></Route>
            <Route exact path="/account/:user" render={(props) => <Account username={this.state.username} {...props} />} ></Route>
            <Route exact path="/account"><Redirect to={`/account/${encodeURIComponent(this.state.username)}`} /></Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default MainApp;
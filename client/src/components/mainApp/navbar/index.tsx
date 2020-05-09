import React from 'react';
import './style.scss';
import {Theme} from '../../../themes';
import { Link } from "react-router-dom";
import axios from 'axios';
import defaultProfile from '../../entry/default.png';

import {MessageCircle, Moon, Circle, Grid, Search, Menu, Sun, LogOut} from 'react-feather';


interface IProps{
  app: any;
}

class Navbar extends React.Component<IProps>{
  constructor(props: IProps){
    super(props);
  }

  componentDidMount(){
    let downX: number = 0;

    document.addEventListener('touchstart', (e) => {
      downX = e.touches[0].clientX;
    }, false);

    document.addEventListener('touchmove', (e) => {
      let upX = e.touches[0].clientX;
      let navbar: any = document.querySelector('#navbar');

      if (downX - upX > 50) {
        navbar.classList.add("nav-open");
      }else if(upX - downX > 50) {
        navbar.classList.remove("nav-open");
      }
    }, false);
  }

  render(){
    return (
      <ul id="navbar">
          <li onClick={() => this.props.app.toggleMenu()} className="navbar-item navbar-menu">
            <Menu color="var(--nav-fg)" className="icons"/>
            <a>Menu</a>
          </li>

          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <li className="navbar-item">
              <Grid color="var(--nav-fg)" className="icons" />
              <a>Dash</a>
            </li>
          </Link>

          <Link to="/search" style={{ textDecoration: 'none', color: 'white' }}>
            <li className="navbar-item">
              <Search color="var(--nav-fg)" className="icons"  />
              <a>Search</a>
            </li>
          </Link>

          <Link to="/message" style={{ textDecoration: 'none', color: 'white' }}>
            <li className="navbar-item">
              <MessageCircle color="var(--nav-fg)" className="icons"  />
              <a>Message</a>
            </li>
          </Link>

          <div className="bottom">

            <Link to="/account" style={{ textDecoration: 'none', color: 'white' }}>
              <li className="navbar-item navbar-account">
                <img src={'/pictures/'+this.props.app.state.picture} />
                <a>Account</a>
              </li>
            </Link>

            <li onClick={() => this.props.app.toggleTheme()} className="navbar-item theme-change">
              <div className={this.props.app.state.theme.title==='dark' ? "active": ""} ><Moon  color="var(--nav-fg)"/></div>
              <div className={this.props.app.state.theme.title==='black' ? "active": ""} ><Circle color="var(--nav-fg)" /></div>
              <div className={this.props.app.state.theme.title==='light' ? "active": ""} ><Sun color="var(--nav-fg)" /></div>
              <a>Theme</a>
            </li>

            <li className="navbar-item" onClick={() => this.props.app.logout()}>
              <LogOut  color="var(--nav-fg)" />
              <a>Logout</a>
            </li>
          </div>
      </ul>
    );
  }
}

export default Navbar;

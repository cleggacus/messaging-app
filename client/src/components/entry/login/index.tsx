import React from 'react';
import './style.scss';
import d from'../default.png';

import {ArrowRight, ArrowLeft} from 'react-feather';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

interface IState{
  redirect: string,
  image: string,
  err: string,
  username: string
}

class Login extends React.Component<{}, IState>{
  page: number;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
      redirect: '',
      image: '/pictures/default',
      err: '',
      username: ''
    }

    this.page = 0;
  }

  componentDidMount(){
    this.switchPage(0);
  }

  switchPage(p: number){
    this.page += p;

    if(this.page < 0)
      this.redirect('/entry');

    let inputUsername: HTMLInputElement = document.querySelector('.input-username') as HTMLInputElement;
    let inputPassword: HTMLInputElement = document.querySelector('.input-password') as HTMLInputElement;
    let textUsername: HTMLHeadingElement = document.querySelector('.text-username') as HTMLHeadingElement;

    switch (this.page) {
      case 0:
        this.setState({
          image: "/pictures/default"
        });
        inputUsername.style.display = 'block';
        inputPassword.style.display = 'none';
        textUsername.style.display = 'none';
        inputUsername.select();
        break;

      case 1:
        axios.post('/api/user/getpublic', {
          username: inputUsername.value
        }).then((res) => {
          if(res.status == 200){
            this.setState({
              image: "/pictures/" + res.data.picture
            });
            
            this.setState({
              username: inputUsername.value
            });
            
            inputUsername.style.display = 'none';
            inputPassword.style.display = 'block';
            textUsername.style.display = 'block';
            inputPassword.select();
            this.err("");
          }else{
            this.err(res.data.data.mes);
            this.page -= p;
          }
        }).catch((err) => {
          this.err(err.response.data.mes ? err.response.data.mes : err);
          this.page -= p;
        });
        
        break;
      case 2:
        axios.post('/api/user/login', {
          username: inputUsername.value,
          password: inputPassword.value
        }).then((res) => {
          if(res.status == 200){
            this.redirect('/');
          }else{
            this.err(res.data.mes);
            this.page -= p;
          }
        }).catch((err) => {
          this.err(err.response.data.mes ? err.response.data.mes : err);
          this.page -= p;
        });
        break;

      default:
        break;
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

  err(mes: string){
    let textErr: HTMLHeadingElement = document.querySelector('.text-err') as HTMLHeadingElement;
    
    this.setState({
      err: mes
    })

    if(mes){
      textErr.style.display = 'block';
    }else{
      textErr.style.display = 'none';
    }
  }
  
  render(){
    return(
      <div className="login">
        <div className="inner-login">
          {this.renderRedirect()}
          <img src={this.state.image}></img>
          <h1 className="text-username" >{this.state.username}</h1>
          <input onKeyDown={(e) => {if(e.keyCode == 13)  this.switchPage(1);}} className="input-username" placeholder="Username" />
          <input onKeyDown={(e) => {if(e.keyCode == 13)  this.switchPage(1);}}  type="password" className="input-password" placeholder="Password" />
          <h3 className="text-err" >{this.state.err}</h3>
          <div className="buttons">
            <div onClick={() => {this.switchPage(-1)}} className="button-back"><ArrowLeft color="var(--primary-fg)"></ArrowLeft></div>
            <div onClick={() => {this.switchPage(1);}} className="button-next"><ArrowRight color="var(--primary-fg)"></ArrowRight></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
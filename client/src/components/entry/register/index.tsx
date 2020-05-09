import React from 'react';
import './style.scss';

import {ArrowRight, ArrowLeft} from 'react-feather';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

interface IState{
  redirect: string,
  err: string,
  propt: string,
  username: string
}

class Register extends React.Component<{}, IState>{
  page: number;

  constructor(props: Readonly<{}>){
    super(props);

    this.state = {
      redirect: '',
      err: '',
      propt: '',
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
    let inputRePassword: HTMLInputElement = document.querySelector('.input-repassword') as HTMLInputElement;
    let textPrompt: HTMLHeadingElement = document.querySelector('.text-prompt') as HTMLHeadingElement;
    let textUsername: HTMLHeadingElement = document.querySelector('.text-username') as HTMLHeadingElement;

    switch (this.page) {
      case 0:
        this.setState({
          propt: 'Pick A Unique Username'
        });

        inputUsername.style.display = 'block';
        inputPassword.style.display = 'none';
        inputRePassword.style.display = 'none';
        textUsername.style.display = 'none';
        inputUsername.select();
        this.err("");
        break;

      case 1:
        axios.post('/api/user/validateUsername', {
          username: inputUsername.value
        }).then((res) => {
          if(res.status == 200){
            this.setState({
              propt: 'Create A Secure Password',
              username: inputUsername.value
            });

            inputUsername.style.display = 'none';
            inputPassword.style.display = 'block';
            inputRePassword.style.display = 'block';
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
        if(inputPassword.value == inputRePassword.value){
          axios.post('/api/user/register', {
            username: inputUsername.value,
            password: inputPassword.value
          }).then((res) => {
            if(res.status == 201){
              this.redirect('/login');
            }else{
              this.err(res.data.data.mes);
              this.page -= p;
            }
          }).catch((err) => {
            this.err(err.response.data.mes ? err.response.data.mes : err);
            this.page -= p;
          });
        }else{
          this.err("Passwords dont match");
          this.page -= p;
        }
        
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
    });

    if(mes){
      textErr.style.display = 'block';
    }else{
      textErr.style.display = 'none';
    }
  }
  
  render(){
    return(
      <div className="register">
        <div className="inner-register">
          {this.renderRedirect()}
          <h1 className="text-username" >{this.state.username}</h1>
          <h2 className="text-prompt" >{this.state.propt}</h2>
          <input onKeyPress={(e) => {if(e.charCode == 13) this.switchPage(1);}} className="input-username" placeholder="Username" />
          <input onKeyPress={(e) => {
            if(e.charCode == 13) (document.querySelector('.input-repassword') as HTMLInputElement).select();
          }} type="password" className="input-password" placeholder="Password" />
          <input onKeyPress={(e) => {if(e.charCode == 13) this.switchPage(1);}} type="password" className="input-repassword" placeholder="Retype Password" />
          <h3 className="text-err" >{this.state.err}</h3>
          <div className="buttons">
            <div onClick={() => {this.switchPage(-1);}} className="button-back"><ArrowLeft color="var(--primary-fg)"></ArrowLeft></div>
            <div onClick={() => {this.switchPage(1);}} className="button-next"><ArrowRight color="var(--primary-fg)"></ArrowRight></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
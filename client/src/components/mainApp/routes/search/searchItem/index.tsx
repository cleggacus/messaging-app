import React from 'react';
import './style.scss';
import axios from 'axios';
import {Redirect} from 'react-router-dom';

interface IProps{
  id:string;
  username: string;
  profilePicture: string;
  status: string;
}

interface IState{
  following: boolean;
  redirect: string;
}

class SearchItem extends React.Component<IProps, IState>{
  constructor(props: IProps){
    super(props);

    this.state = {
      following: false,
      redirect: ''
    }

    this.checkIsFollowing();
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

  checkIsFollowing(){
    axios.post('/api/user/isFollowing', {id: this.props.id}).then(res => {
      if(res.status == 200){
        this.setState({
          following: res.data.following
        });
      }
    })
  }

  follow(){
    axios.post('/api/user/follow', {id: this.props.id, follow: !this.state.following}).then(res => {
      if(res.status == 200){
        this.checkIsFollowing();
      }
      console.log(res.data.mes);
    }).catch(err => {
      console.log(err);
    })
  }

  render(){
    return(
      <div className="searchItem">
      {this.renderRedirect()}
        <div onClick={() => this.redirect('/account/'+encodeURIComponent(this.props.username))} className="searchItem-ProfilePic">
          <img src={this.props.profilePicture} />
        </div>

        <div onClick={() => this.redirect('/account/'+encodeURIComponent(this.props.username))} className="searchItem-details">
          <h2>{this.props.username}</h2>
          <h3>{this.props.status}</h3>
        </div>

        <div className="bottom">
          <div onClick={() => this.follow()} className="searchItem-follow">
            <h2>{this.state.following ? "following" : "follow"}</h2>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchItem;
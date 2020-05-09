import React from 'react';
import './style.scss';
import {Camera, Edit} from 'react-feather';
import axios from 'axios';

import EditStatus from './EditStatus';
import EditProfilePic from './EditProfilePic';

interface IState{
  username: string;
  id: string;
  status: string;
  picture: string;
  editStatusOpen: boolean;
  editProfilePicOpen: boolean;
  following: boolean;
}

interface IProps{
  match: any;
  username: any;
}

class Account extends React.Component<IProps, IState>{
  target: string;

  constructor(props: IProps){
    super(props);

    this.target = decodeURIComponent(this.props.match.params.user);

    this.state = {
      username: '',
      status: '',
      picture: 'default',
      id: '',
      editStatusOpen: false,
      editProfilePicOpen: false,
      following: false
    };
  }

  componentDidMount(){
    this.updateInfo();
  }

  updateInfo(){
    axios.post('/api/user/getpublic', {username: this.target}).then(res => {
      this.setState({
        username: res.data.username,
        status: res.data.status,
        picture: res.data.picture,
        id: res.data.id
      })

      this.checkIsFollowing();
    }).catch(err => {
      this.setState({
        username: 'notfound'
      })
    })
  }

  checkIsFollowing(){
    axios.post('/api/user/isFollowing', {id: this.state.id}).then(res => {
      if(res.status == 200){
        this.setState({
          following: res.data.following
        });
      }
    })
  }

  follow(){
    axios.post('/api/user/follow', {id: this.state.id, follow: !this.state.following}).then(res => {
      if(res.status == 200){
        this.checkIsFollowing();
      }
    }).catch(err => {
      console.log(err);
    })
  }

  toggleStatusDialog(x: boolean){
    this.setState({
      editStatusOpen: x
    })
  }

  toggleProfilePicDialog(x: boolean){
    this.setState({
      editProfilePicOpen: x
    })
  }

  render(){
    if(this.state.username == 'notfound'){
      return(
        <div className="usernotfound">
            <h1>User '{this.target}' Not Found</h1>
        </div>
      )
    }else if(this.state.username == this.props.username){
      return(
        <div className="account">
          <div className="profile-info">
            <div onClick={() => this.setState({editProfilePicOpen: true})} className="profile-info-pic">
              <img className="hover-img" src={'/pictures/'+this.state.picture}></img>
              <Camera color="var(--primary-fg)" className="profile-info-pic-edit" />
            </div>
            <h1>{this.state.username}</h1>
            <h3>{this.state.status}</h3>
          
            <div className="bottom">
              <div onClick={() => this.setState({editStatusOpen: true})} className="profile-info-btn">
                <h2>Edit Status</h2>
              </div>
            </div>
          </div>
          <EditStatus status={this.state.status} update={this.updateInfo.bind(this)} toggle={this.toggleStatusDialog.bind(this)} isOpen={this.state.editStatusOpen} />
          <EditProfilePic image={'/pictures/'+this.state.picture} update={this.updateInfo.bind(this)} toggle={this.toggleProfilePicDialog.bind(this)} isOpen={this.state.editProfilePicOpen} />
        </div>
      );
    }else{
      return(
        <div className="account">
          <div className="profile-info">
            <div className="profile-info-pic">
              <img src={'/pictures/'+this.state.picture}></img>
            </div>
            <h1>{this.state.username}</h1>
            <h3>{this.state.status}</h3>
            
            <div className="bottom">
              <div onClick={() => this.follow()} className="profile-info-btn">
                <h2>{this.state.following ? "following" : "follow"}</h2>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Account;
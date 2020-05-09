import React from 'react';
import axios from 'axios';

interface IProps{
  id: string;
  type: number;
  createdAt: string;
}

interface IState{
  username: string;
  picture: string;
}

class NotificationItem extends React.Component<IProps, IState>{
  constructor(props: any){
      super(props);
      this.state = {
        username: '',
        picture: 'default'
      }

      this.getUsername();
  }

  getUsername(){
    axios.post('/api/user/getpublic', {id: this.props.id}).then(res => {
      if(res.status == 200){
        this.setState({
          username: res.data.username,
          picture: res.data.picture
        });
      }
    }).catch(err => {
      console.log(err);
    })
  }

  getTimeAge(){
    let seconds = Math.floor((new Date().getTime() - Date.parse(this.props.createdAt)) / 1000);
  
    let interval = Math.floor(seconds / (60 * 60 * 24 * 30 * 12));
  
    if (interval > 1) {
      return interval + "y";
    }
    interval = Math.floor(seconds / (60 * 60 * 24 * 30));
    if (interval > 1) {
      return interval + "m";
    }
    interval = Math.floor(seconds / (60 * 60 * 24));
    if (interval > 1) {
      return interval + "d";
    }
    interval = Math.floor(seconds / (60 * 60));
    if (interval > 1) {
      return interval + "h";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + "m";
    }
    return Math.floor(seconds) + "s";
  }

  render(){
    return(
      <div className="notification-item">
        <div className="notification-item-pic">
          <img src={'/pictures/'+this.state.picture}></img>
        </div>
  
        <div className="notification-item-info">
          <h3>{this.state.username}</h3>
          <h4>{this.props.type == 0 ? 'followed you' : 'nope'}</h4>
          <h5>{this.getTimeAge()}</h5>
        </div>
      </div>
    );
  }
}


export default NotificationItem;
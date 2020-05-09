import React from 'react';
import './style.scss';
import axios from 'axios';
import NotificationItem from './notificationItem';

interface IState{
  notifications: {
    id: string,
    type: number,
    extra: string,
    createdAt: string
  }[]
}

class Notifications extends React.Component<{}, IState>{
  constructor(props: any){
    super(props);

    this.state = {
      notifications: []
    }

    this.getNotifications();
  }

  getNotifications(){
    axios.get('/api/user/getNotifications').then(res => {
      if(res.status == 200){
        this.setState({
          notifications: res.data.notifications
        })
      }
    }).catch(err => {
      
    })
  }

  render(){
    const notifications = this.state.notifications.map((item, key) => {
      return <NotificationItem id={item.id} type={item.type} createdAt={item.createdAt} />
    });

    return(
      <div className="notifications">
        <h1>Notifications</h1>
        {notifications}
      </div>
    );
  }
}

export default Notifications;
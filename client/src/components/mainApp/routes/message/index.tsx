import React from 'react';
import './style.scss';

class Message extends React.Component{
  constructor(props: Readonly<{}>){
    super(props);
  }
  

  render(){
    return(
      <div className="message">
        <h1>Message</h1>
      </div>
    );
  }
}

export default Message;
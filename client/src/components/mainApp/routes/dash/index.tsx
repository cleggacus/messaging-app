import React from 'react';
import './style.scss';

import Notifications from './notification';

class Dash extends React.Component<{}, {}>{
  constructor(props: any){
    super(props);
  }
  
  render(){
    return(
      <div className="dash">
        <Notifications />
      </div>
    );
  }
}

export default Dash;
import React from 'react';
import './style.scss';

import {XCircle} from 'react-feather';

interface IProps{
    isOpen: boolean;
    toggle: Function;
    title: string;
}

class Dialog extends React.Component<IProps>{
  constructor(props: IProps){
    super(props);
  }

  render(){
    if(this.props.isOpen){
      return(
        <div className="dialog">
            <div onClick={() => this.props.toggle(false)} className="dialog-bg"></div>
            <div className="dialog-content">
                <div className="dialog-title-bar">
                    <h2 className="dialog-title">{this.props.title}</h2>
                    <XCircle onClick={() => this.props.toggle(false)}  color="var(--primary-fg)" className="dialog-exit-btn"/>
                </div>
                
                <div className="dialog-items">
                    {this.props.children}
                </div>
            </div>
        </div>
      );
    }else{
      return(
        <div></div>
      )
    }
  }
}

export default Dialog;
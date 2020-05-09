import React from 'react';
import './style.scss';
import Dialog from '../../../dialog';
import axios from 'axios';

interface IProps{
  isOpen: boolean;
  toggle: Function;
  update: Function;
  status: string;
}

interface IState{
  err: string;
}

class EditStatus extends React.Component<IProps, IState>{
  constructor(props: IProps){
    super(props);

    this.state = {
      err: ''
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
  
  updateStatus(){
    let status: HTMLTextAreaElement = document.querySelector('.input-status') as HTMLTextAreaElement;
    axios.post('/api/user/updateStatus', {status: status.value}).then(res => {
      if(res.status == 200){
        this.props.update();
        this.props.toggle();
      }else{
        this.err(res.data.mes);
      }
    }).catch(err => {
      this.err(err.response.data.mes);
    })
  }

  render(){
    return(
      <Dialog title="Edit Status" toggle={this.props.toggle} isOpen={this.props.isOpen}>
        <textarea rows={4} onKeyPress={(e) => {if(e.charCode == 13) console.log()}} className="input-status" placeholder="Status">{this.props.status}</textarea>
        <h3 className="text-err" >{this.state.err}</h3>
        <button onClick={() => this.updateStatus()}>Update Status</button>
      </Dialog>
    )
  
  }
}

export default EditStatus;
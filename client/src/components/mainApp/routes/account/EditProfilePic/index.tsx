import React from 'react';
import './style.scss';
import Dialog from '../../../dialog';
import ImageCrop from '../ImageCrop';
import axios from 'axios';

interface IProps{
  isOpen: boolean;
  toggle: Function;
  update: Function;
  image: string;
}

interface IState{
  image: string;
  err: string;
}

class EditProfilePic extends React.Component<IProps, IState>{
  constructor(props: IProps){
    super(props);
    this.state = {
      image: this.props.image,
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

  openImage(){
    let inputFile: HTMLInputElement = document.querySelector('.pic-file-input') as HTMLInputElement;
    inputFile.click();
  }

  onOpenImage(e:any){
    this.setState({
      image: URL.createObjectURL(e.target.files[0])
    });
  }

  uploadImage(){
    let canvas: HTMLCanvasElement | null = document.querySelector("#image-crop-canvas");

    if(canvas){
      canvas.toBlob((blob: any) => {
        const formData = new FormData();
        formData.append('picture', blob);
        axios.post('/api/user/updatePicture', formData).then(res => {
          if(res.status == 200){
            this.props.update();
            this.props.toggle();
          }else{
            this.err(res.data.mes);
          }
        }).catch(err => {
          this.err(err.response.data.mes);
        });
      });
    }
  }

  render(){
    return(
      <Dialog title="Edit Profile Pic" toggle={this.props.toggle} isOpen={this.props.isOpen}>
        <div className="imgCrop"><ImageCrop image={this.state.image} /></div>
        <h3 className="text-err" >{this.state.err}</h3>
        <button onClick={() => this.openImage()} className="pic-select-btn">Select Image</button>
        <button onClick={() => this.uploadImage()}>Confirm</button>
        <input onChange={this.onOpenImage.bind(this)} type="file"  accept="image/*" capture="camera" className="pic-file-input" />
      </Dialog>
    )
  }
}

export default EditProfilePic;
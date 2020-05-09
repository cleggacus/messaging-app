import React from 'react';
import './style.scss';

interface IProps{
  image: string;
}

class ImageCrop extends React.Component<IProps>{
  ctx: CanvasRenderingContext2D | null;
  now: number;
  elapsed: number;
  then: number;
  fpsInterval: number;

  constructor(props: IProps){
    super(props);
    this.ctx = null;
    this.now = 0;
    this.elapsed = 0;
    this.then = 0;
    this.fpsInterval = 0;
  }

  componentDidMount(){
    let canvas: HTMLCanvasElement | null = document.querySelector("#image-crop-canvas");

    if(canvas){
      const fps = 60;
      
      this.fpsInterval = 1000 / fps;
      this.then = Date.now();
      this.ctx = canvas.getContext('2d');


      if(canvas.parentElement){
        canvas.width = 500;
        canvas.height = 500;
      }

      this.animate();
    }
  }

  animate(){
    requestAnimationFrame(this.animate.bind(this));

    this.now = Date.now();
    this.elapsed = this.now - this.then;

    if (this.elapsed > this.fpsInterval) {
        this.update();
        this.then = this.now - (this.elapsed % this.fpsInterval);
        this.draw();
    }
  }

  draw(){
    if(this.ctx){
      const img = new Image();
      
      img.src = this.props.image;

      if(img.width/img.height > this.ctx.canvas.width/this.ctx.canvas.height){
        //img wider than ctx
        this.ctx.drawImage(img,
          (img.width-img.height * (this.ctx.canvas.width/this.ctx.canvas.height))*0.5, 0, img.height * (this.ctx.canvas.width/this.ctx.canvas.height), img.height,
          0, 0, this.ctx.canvas.width, this.ctx.canvas.height,
        );
      }else{
        this.ctx.drawImage(img,
          0, (img.height-img.width*(this.ctx.canvas.height/this.ctx.canvas.width))*0.5 , img.width, img.width*(this.ctx.canvas.height/this.ctx.canvas.width),
          0, 0, this.ctx.canvas.width, this.ctx.canvas.height,
        );
      }
      /*
      this.ctx.fillStyle = '#0009';
      this.ctx.beginPath();
      this.ctx.arc(this.ctx.canvas.width/2,this.ctx.canvas.height/2,this.ctx.canvas.height/2,0,Math.PI*2);
      this.ctx.rect(this.ctx.canvas.width, 0, -this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.closePath();
      this.ctx.fill();
      */
    }
  }

  update(){

  }

  render(){
    return(
      <canvas id="image-crop-canvas"></canvas>
    )
  }
}

export default ImageCrop;
import React from 'react';
import Sketch from 'react-p5';
import * as ml5 from "ml5";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithubSquare } from '@fortawesome/free-brands-svg-icons'

import './style.css';


class App extends React.Component{
 stateM={
   mode:0
 }


render(){

let video;
let poseNet;
let point;
let imgBack1;
let imgBack2;
let imgBack3;
let imgBack4;
let imgBack5;
let imgNoWebcam;
let shade;



return(
  <div className="App">
  <div className="TitleDiv">
  <img src="https://res.cloudinary.com/jaacker25/image/upload/v1588293564/stickMan/title_jsz90z.webp" alt="title" className="Title"></img>
  </div>   
     <Sketch
className="Sketch"
setup={async(p5, parentRef)=>{
p5.createCanvas(1024,576)
  .parent(parentRef)
 // .position((p5.windowWidth-p5.width)/2,p5.auto);
imgBack1 = p5.createImg('https://res.cloudinary.com/jaacker25/image/upload/v1588293564/stickMan/stickBack_4_qspkau.webp','stickBack_4');
imgBack1.hide();
imgBack2 = p5.createImg('https://res.cloudinary.com/jaacker25/image/upload/v1588293564/stickMan/stickBack_5_ao0zg9.webp','stickBack_5');
imgBack2.hide();
imgBack3 = p5.createImg('https://res.cloudinary.com/jaacker25/image/upload/v1588293564/stickMan/stickBack_2_wwjo6z.webp','stickBack_2');
imgBack3.hide();
imgBack4 = p5.createImg('https://res.cloudinary.com/jaacker25/image/upload/v1588293564/stickMan/stickBack_3_eczjw2.webp','stickBack_3');
imgBack4.hide();
imgBack5 = p5.createImg('https://res.cloudinary.com/jaacker25/image/upload/v1588293564/stickMan/stickBack_1_cro3ig.webp','stickBack_1');
imgBack5.hide();
imgNoWebcam = p5.createImg('https://res.cloudinary.com/jaacker25/image/upload/v1588299210/stickMan/noweb_ijtcwa.webp','noWebImg');
imgNoWebcam.hide();

p5.noFill();
        
video = p5.createCapture({video: {
                                  mandatory: {
                                  minWidth: 1024,
                                  minHeight: 576
                                  },
                                  optional: [{ maxFrameRate: 15 }]
                                  },
                          audio: false
                          });
                          

video.hide();
poseNet = ml5.poseNet(video,()=>{console.log('Model Ready!')});
poseNet.on('pose', results=>{
if(results.length){
  point=results[0].pose.keypoints;
  }
});     
shade=0;  

}}


draw={p5=>{
//with real time video background 
if(video.loadedmetadata){
switch(this.stateM.mode){

case 0:
p5.translate(p5.width,0);
p5.scale(-1.0,1.0);  
p5.image(video, 0, 0);
break;
case 1:
p5.translate(p5.width,0);
p5.scale(-1.0,1.0);  
p5.image(video, 0, 0);
p5.noStroke();
p5.fill(0,200); 
p5.rect(0,0,p5.width,p5.height);
p5.noFill();
break;
case 2:
//with static image background 
p5.image(imgBack1, 0, 0);   
break;
case 3:
//with static image background 
p5.image(imgBack2, 0, 0);   
break;
case 4:
//with static image background 
p5.image(imgBack3, 0, 0);   
break;
case 5:
//with static image background 
p5.image(imgBack4, 0, 0);    
break;
case 6:
//with static image background 
p5.image(imgBack5, 0, 0);   
break;

case 7:
//GOST effect

p5.noStroke();
p5.fill(0,30); 
p5.rect(0,0,p5.width,p5.height);
p5.noFill();
break;

default:
break;
}








if(point){

//Get the stick man base color

let rColor=0;
let gColor=0;
let bColor=0;
if(this.stateM.mode!==0){
rColor=255*p5.noise(shade/1.0);
gColor=255-255*p5.noise(shade/1.0);
bColor=255;
}
//Pose Points to structure the entire body
let sizeHead = (((point[3].position.x-point[4].position.x)**2)+((point[3].position.y-point[4].position.y)**2))**.5;
sizeHead*=1.2;
let hipPoint={x:0,y:0};
hipPoint.x=(point[12].position.x+point[11].position.x)/2;
hipPoint.y=(point[12].position.y+point[11].position.y)/2;
let neckPoint={x:0,y:0};
neckPoint.x=point[0].position.x;
neckPoint.y=point[0].position.y+(sizeHead/2);

let strokeW;
let alphaColor;

//Mirror effect
p5.translate(p5.width,0); // move to far corner
p5.scale(-1.0,1.0);    // flip x-axis backwards 


//Draw the stick man!
for(let layer=0;layer<4;layer++){
switch(layer){

case 0: 
//1st Shade
strokeW=50;
alphaColor=11;
break;
case 1: 
//2nd Shade
strokeW=25;
alphaColor=15;
break; 
case 2:
//Body
strokeW=12;
alphaColor=200;
break;
case 3:
//Center
strokeW=4;
break;
default:
break;
}

p5.strokeWeight(strokeW);

if(this.stateM.mode===0){
  p5.stroke(0);
}else{

if(strokeW===4){
  p5.stroke(255);
}else{
  p5.stroke(rColor,gColor,bColor,alphaColor);
}
}
//head
p5.ellipseMode(p5.CENTER);
p5.ellipse(point[0].position.x,point[0].position.y, sizeHead, sizeHead);
//body
p5.line(neckPoint.x,neckPoint.y,hipPoint.x,hipPoint.y);
// Right shoulder
p5.line(neckPoint.x,neckPoint.y,point[8].position.x,point[8].position.y);
p5.line(point[8].position.x,point[8].position.y,point[10].position.x,point[10].position.y);
// Left shoulder
p5.line(neckPoint.x,neckPoint.y,point[7].position.x,point[7].position.y);
p5.line(point[7].position.x,point[7].position.y,point[9].position.x,point[9].position.y);
// Right leg
p5.line(hipPoint.x,hipPoint.y,point[14].position.x,point[14].position.y);
p5.line(point[14].position.x,point[14].position.y,point[16].position.x,point[16].position.y);
// Left leg
p5.line(hipPoint.x,hipPoint.y,point[13].position.x,point[13].position.y);
p5.line(point[13].position.x,point[13].position.y,point[15].position.x,point[15].position.y);

}

shade++;
shade>=1.2?shade=0:shade+=0;

}
}else{
  p5.image(imgNoWebcam, 0, 0); 
}
  }
      }
    />
    <div className="Control">
      <div className="btnControl" onClick={()=>{this.stateM.mode++;
                                                if(this.stateM.mode>7){
                                                  this.stateM.mode=0;
                                                }
                                                }}>
      <h3 className="titleBtn">Mode Change</h3>
      </div>
    </div>
    <footer className="Footer">
      <h3 className="titleFooter">by Jorge Aguilar @jaacker25</h3>
      <div className="Icons">
      <FontAwesomeIcon className="icon" icon={faGithubSquare} size="3x" onClick={()=>window.open('https://github.com/jaacker25', "_blank")} />
      <FontAwesomeIcon className="icon" icon={faLinkedin} size="3x" onClick={()=>window.open('https://www.linkedin.com/in/jorge-aguilar-castillo', "_blank")}/>
      </div>
      <p>|</p>
      <p>2020</p>
    </footer>
  </div>
)

}

}

export default App;

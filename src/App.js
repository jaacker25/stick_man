import React from 'react';
import Sketch from 'react-p5';
import * as ml5 from "ml5";
import './App.css';


class App extends React.Component{
 
render(){

let video;
let poseNet;
let point;
let img;
let shade;

return(
  <div className="App">
    <h1>StickMan App</h1>
     <Sketch
setup={async(p5, parentRef)=>{
p5.createCanvas(1024,576)
  .parent(parentRef)
  .position((p5.windowWidth-p5.width)/2,p5.auto);
img = p5.createImg('https://res.cloudinary.com/jaacker25/image/upload/v1588121596/backImage_mivt8j.png');
img.hide();
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
p5.translate(p5.width,0);
p5.scale(-1.0,1.0);  
//GOST effect
//p5.tint(0, 0, 0, 20);
p5.image(video, 0, 0);
p5.noStroke();
p5.fill(0,200); 
p5.rect(0,0,p5.width,p5.height);
p5.noFill();

//with static image background 
//p5.image(img, 0, 0);   

//with black solid color background 
//p5.background(0);

if(point){

//Get the stick man base color
let rColor=255*p5.noise(shade/1.0);
let gColor=255-255*p5.noise(shade/1.0);
let bColor=255;

//Pose Points to structure the entire body
let sizeHead = (((point[3].position.x-point[4].position.x)**2)+((point[3].position.y-point[4].position.y)**2))**.5;
sizeHead*=1.2;
let hipPoint={x:0,y:0};
hipPoint.x=(point[12].position.x+point[11].position.x)/2;
hipPoint.y=(point[12].position.y+point[11].position.y)/2;
let neckPoint={x:0,y:0};
neckPoint.x=point[0].position.x;
neckPoint.y=point[0].position.y+(sizeHead/2);


//Mirror effect
p5.translate(p5.width,0); // move to far corner
p5.scale(-1.0,1.0);    // flip x-axis backwards 


//Draw the stick man!
for(let layer=0;layer<4;layer++){
switch(layer){

case 0: 
//1st Shade
p5.strokeWeight(50);
p5.stroke( rColor,gColor,bColor,11);
break;
case 1: 
//2nd Shade
p5.strokeWeight(25);
p5.stroke( rColor,gColor,bColor,15);
break; 
case 2:
//Body
p5.strokeWeight(12);
p5.stroke( rColor,gColor,bColor,200);
break;
case 3:
//Center
p5.strokeWeight(4);
p5.stroke( 255,255,255,255,255);
break;
default:
break;
}

//head
p5.ellipseMode('CENTER');
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
  }
      }
    />
  </div>
)

}

}

export default App;

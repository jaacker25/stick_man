let video;
let poseNet;
let point;
let gap;

let img;

function setup() {
let canvas=createCanvas(1024,576);
canvas.position((windowWidth-width)/2,(windowHeight-height)/2);


img = createImg('https://res.cloudinary.com/jaacker25/image/upload/v1588121596/backImage_mivt8j.png');
img.hide();
noFill();
strokeWeight(15);
stroke("BLACK")
let constraints = {
  video: {
    mandatory: {
      minWidth: 1024,
      minHeight: 576
    },
    optional: [{ maxFrameRate: 15 }]
  },
  audio: false
};



video = createCapture(constraints);
poseNet = ml5.poseNet(video, modelLoaded);
poseNet.on('pose', results=>{
  if(results.length){
  point=results[0].pose.keypoints;
  }
});
video.hide();
}


function modelLoaded() {
    console.log('Model Loaded!');
  }


function draw() {
  
  image(video, 0, 0);  
//background(50);
 
gap=0;
  
  if(point){
    //console.log(point)
 


//messure circle size
 let sizeHead = (((point[3].position.x-point[4].position.x)**2)+((point[3].position.y-point[4].position.y)**2))**.5;
 sizeHead*=1.2;
 let hipPoint={x:0,y:0};
 hipPoint.x=(point[12].position.x+point[11].position.x)/2;
 hipPoint.y=(point[12].position.y+point[11].position.y)/2;
 let neckPoint={x:0,y:0};
neckPoint.x=point[0].position.x;
neckPoint.y=point[0].position.y+(sizeHead/2);

if(neckPoint.x>=512){
gap=-512
}else{
gap=512
}


  //head
  ellipseMode(CENTER);
  ellipse(point[0].position.x+gap,point[0].position.y, sizeHead, sizeHead);
  //body
  line(neckPoint.x+gap,neckPoint.y,hipPoint.x+gap,hipPoint.y);
  // Right shoulder
  line(neckPoint.x+gap,neckPoint.y,point[8].position.x+gap,point[8].position.y);
  line(point[8].position.x+gap,point[8].position.y,point[10].position.x+gap,point[10].position.y);
  // Left shoulder
  line(neckPoint.x+gap,neckPoint.y,point[7].position.x+gap,point[7].position.y);
  line(point[7].position.x+gap,point[7].position.y,point[9].position.x+gap,point[9].position.y);
  // Right leg
  line(hipPoint.x+gap,hipPoint.y,point[14].position.x+gap,point[14].position.y);
  line(point[14].position.x+gap,point[14].position.y,point[16].position.x+gap,point[16].position.y);
  // Left leg
  line(hipPoint.x+gap,hipPoint.y,point[13].position.x+gap,point[13].position.y);
  line(point[13].position.x+gap,point[13].position.y,point[15].position.x+gap,point[15].position.y);

}



}

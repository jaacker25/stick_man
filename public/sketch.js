let video;
let poseNet;
let point;
let img;
let shade;


function setup() {
let canvas=createCanvas(1024,576);
canvas.position((windowWidth-width)/2,(windowHeight-height)/2);


img = createImg('https://res.cloudinary.com/jaacker25/image/upload/v1588121596/backImage_mivt8j.png');
img.hide();
noFill();

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

shade=0;
layer=0;
}


function modelLoaded() {
    console.log('Model Ready!');
  }


function draw() {

 //with real time video background 
 translate(width,0);
 scale(-1.0,1.0);  
//GOST effect
// tint(0, 0, 0, 20);
 image(video, 0, 0);
 noStroke();
 fill(0,200); 
rect(0,0,width,height);
noFill();

 //with static image background 
 //image(img, 0, 0);   

 //with black solid color background 

 //background(0);
 
  
  if(point){

    //Get the stick man base color
    let rColor=255*noise(shade/1.0);
    let gColor=255-255*noise(shade/1.0);
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
translate(width,0); // move to far corner
scale(-1.0,1.0);    // flip x-axis backwards 




//Draw the stick man!
for(let layer=0;layer<4;layer++){
switch(layer){

  case 0: 
    //1st Shade
    strokeWeight(50);
    stroke( rColor,gColor,bColor,11);
    break;
  case 1: 
    //2nd Shade
    strokeWeight(25);
    stroke( rColor,gColor,bColor,15);
    break; 
  case 2:
    //Body
    strokeWeight(12);
    stroke( rColor,gColor,bColor,200);
    break;
  case 3:
    //Center
    strokeWeight(4);
    stroke( 255,255,255,255,255);
    break;
  default:
    break;
}

  //head
  ellipseMode(CENTER);
  ellipse(point[0].position.x,point[0].position.y, sizeHead, sizeHead);
  //body
  line(neckPoint.x,neckPoint.y,hipPoint.x,hipPoint.y);
  // Right shoulder
  line(neckPoint.x,neckPoint.y,point[8].position.x,point[8].position.y);
  line(point[8].position.x,point[8].position.y,point[10].position.x,point[10].position.y);
  // Left shoulder
  line(neckPoint.x,neckPoint.y,point[7].position.x,point[7].position.y);
  line(point[7].position.x,point[7].position.y,point[9].position.x,point[9].position.y);
  // Right leg
  line(hipPoint.x,hipPoint.y,point[14].position.x,point[14].position.y);
  line(point[14].position.x,point[14].position.y,point[16].position.x,point[16].position.y);
  // Left leg
  line(hipPoint.x,hipPoint.y,point[13].position.x,point[13].position.y);
  line(point[13].position.x,point[13].position.y,point[15].position.x,point[15].position.y);

}

shade++;
shade>=1.2?shade=0:null;

}



}

let x= 0.01;
let y= 0;
let z= 0;

let a= 0.2;
let b= 0.2;
let c= 5.7;

let points= new Array();
function setup() {
  createCanvas(400, 400, WEBGL);
  colorMode(HSB);

}

function draw() {
  background(0);
  let dt= 0.05;
  let dx= (-y-z)*dt;
  let dy= (x + a*y) * dt;
  let dz= (b+ z*(x-c)) * dt;
  x=x+dx;
  y=y+dy;
  z=z+dz;

points.push(new p5.Vector(x,y,z));
translate(0,0,-80);
let camX=map(mouseX,0,width,-200,200);
let camY=map(mouseY,0,height,-200,200);
camera(camX,camY,(height/2.0)/tan(PI*30.0/180.0),0,0,0,0,1,0);
scale(5);
stroke(255);
noFill();
let hu=0;
beginShape();

for(let v of points){
  stroke(hu,255,255);
  vertex(v.x,v.y,v.z);
  hu+=1;
  if(hu>255){
    hu=0;
  }
}
endShape();
}
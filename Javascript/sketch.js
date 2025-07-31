var inc=1;
var scl=10;
var cols, rows;
var zoff =0;
var fr;
var particles = [];
var flowfield;

function setup() {
  createCanvas(600, 400);
  cols=floor(width/scl);
  rows=floor(height/scl);
  fr=createP('');
  flowfield = new Array(cols*rows);
  for(var i=0;i<300;i++){
    particles[i]=new Particle();
   // particles[i].StrokeColor(i);
  }
  background(51);
}

function draw() {
  var yoff=0;
  for(var y=0;y<rows;y++){
    var xoff=0;
    for(var x=0;x<cols;x++){
      var index=x+y*cols;
      var angle=noise(xoff,yoff,zoff)*4;
      
      var v= p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index]=v;
      xoff+=inc;
      stroke(0,50);
    }
    yoff+=inc;
    zoff+=0.0003;
  }
  for(var i=0;i<particles.length;i++)
  {
    particles[i].follow(flowfield);
    particles[i].update();
    particles[i].edges();
    particles[i].show();
  }
}

function setup() {
  createCanvas(400, 400);
  sun = new Planet(50,0,0,random(TWO_PI),(random(200,255)));
  sun.spawnMoons(5,1);
}

function draw() {
  background(51);
  translate(width/2,height/2);
  sun.show();
  sun.orbit();
}

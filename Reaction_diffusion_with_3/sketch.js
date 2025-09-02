var grid;
var next;
var dA=1;
var dB=0.4;
var dC=0.07;
var feed=0.15;
var k=0.032;
var k1=0.01;
function setup() {
  createCanvas(200, 200);
  pixelDensity(1);
  grid=[];
  next=[];
  for(var x=0;x<width;x++){
    grid[x]=[];
    next[x]=[];
    for(var y=0;y<height;y++){
      grid[x][y]={
        a:1,b:0,c:0
      };
      next[x][y]={
        a:1,
        b:0,
        c:0
      };
    }
  }
  //To drop the b reagent;
  for(var i=100;i<110;i++){
    for(var j=100;j<110;j++){
      grid[i][j].b=1;
    }
  }
  for(var i=111;i<115;i++){
    for(var j=111;j<115;j++){
      grid[i][j].c=1;
    }
  }
}

function draw() {
  background(51);

  for(var x=1;x<width-1;x++){
    for(var y=1;y<height-1;y++){
      var a=grid[x][y].a;
      var b=grid[x][y].b;
      var c=grid[x][y].c;
      next[x][y].a=a+
      (dA * laplaceA(x,y)) -
      (a * b*b) +
      (feed * (1 - a));
      next[x][y].b=b+
      (dB * laplaceB(x,y))+
      (a * b *b)-(b*c*c)-((k+feed)*b);
      next[x][y].c=c+
      (dC * laplaceC(x,y))+
      (b * c * c)-((k1)*c);

      next[x][y].a=constrain(next[x][y].a,0,1);
      next[x][y].b=constrain(next[x][y].b,0,1);
      next[x][y].c=constrain(next[x][y].c,0,1);
    }
  }
  loadPixels();
  for(var x=0;x<width;x++){
    for(var y=0; y<height;y++){
      var pix = (x+y*width)*4;
      var a = next[x][y].a;
      var b = next[x][y].b;
      var c = next[x][y].c;
      var d = ((a-b-c)*255)
      pixels[pix+0]=d;
      pixels[pix+1]=d;
      pixels[pix+2]=d;
      pixels[pix+3]=255;
    }
  }
  updatePixels();
  swap();
}
function laplaceA(x,y){
  var sumA=0;
  sumA+=grid[x][y].a* -1;
  sumA+=grid[x-1][y].a * 0.2;
  sumA+=grid[x+1][y].a * 0.2;
  sumA+=grid[x][y+1].a * 0.2;
  sumA+=grid[x][y-1].a * 0.2;
  sumA+=grid[x-1][y-1].a*0.05;
  sumA+=grid[x+1][y-1].a*0.05;
  sumA+=grid[x+1][y+1].a*0.05;
  sumA+=grid[x-1][y+1].a*0.05;
  return sumA;
}

function laplaceB(x,y){
  var sumB=0;
  sumB+=grid[x][y].b* -1;
  sumB+=grid[x-1][y].b * 0.2;
  sumB+=grid[x+1][y].b * 0.2;
  sumB+=grid[x][y+1].b* 0.2;
  sumB+=grid[x][y-1].b * 0.2;
  sumB+=grid[x-1][y-1].b*0.05;
  sumB+=grid[x+1][y-1].b*0.05;
  sumB+=grid[x+1][y+1].b*0.05;
  sumB+=grid[x-1][y+1].b*0.05;
  return sumB;
}
function laplaceC(x,y){
  var sumC=0;
  sumC+=grid[x][y].c* -1;
  sumC+=grid[x-1][y].c * 0.2;
  sumC+=grid[x+1][y].c * 0.2;
  sumC+=grid[x][y+1].c* 0.2;
  sumC+=grid[x][y-1].c * 0.2;
  sumC+=grid[x-1][y-1].c*0.05;
  sumC+=grid[x+1][y-1].c*0.05;
  sumC+=grid[x+1][y+1].c*0.05;
  sumC+=grid[x-1][y+1].c*0.05;
  return sumC;
}
function swap(){
  var temp=grid;
  gird=next;
  next=temp;
}
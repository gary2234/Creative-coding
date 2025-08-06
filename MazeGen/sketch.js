var cols, rows;
var w = 20;
var grid= [];
var current=[];
var stack = [];
var stack1= [];
var mazester = 10;
function setup() {
  createCanvas(600, 600);
  cols= floor(width/w);
  rows= floor(height/w);
  for(var j = 0;j<rows; j++){
    for(var i = 0;i<cols;i++){
      var cell = new Cell(i,j);
      grid.push(cell); 
    }
  }
  for(var i=0;i<mazester;i++)
  {
    current[i]=grid[i];
  }
}

function draw() {
  background(51);
  for(var i =0;i<grid.length;i++){
    grid[i].show();
  }
 
  for(var i=0;i<mazester;i++){
    current[i].visited=true;
    current[i].highlight();
  }
  //STEP 1
  var next = [];
  for(var i=0;i<mazester;i++){
    next[i]=current[i].checkNeighbors();
  }
  
  for(var i=0;i<mazester;i++){
    if(next[i]){
      next[i].visited=true;
      stack.push(current[i]);
      removeWalls(current[i],next[i]);
      current[i]=next[i];
    }
    else if(stack.length>0){
      current[i]=stack.pop();
    }
  }
 
}
function index(i,j){
  if(i<0|| j<0 || i>cols -1 || j>rows -1){
    return -1;
  }
  return i+j*cols;
}
function removeWalls(a,b){
  var x= a.i-b.i;
  if(x === 1){
    a.walls[3]=false;
    b.walls[1]=false;
  }else if(x ===-1){
    a.walls[1]=false;
    b.walls[3]=false;
  }
  var y= a.j-b.j;
  if(y === 1){
    a.walls[0]=false;
    b.walls[2]=false;
  }else if(y ===-1){
    a.walls[2]=false;
    b.walls[0]=false;
  }
}


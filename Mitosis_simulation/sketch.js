var cells=[];
function setup() {
  createCanvas(700,700);
  cells.push(new Cell());
  cells.push(new Cell());
}

function draw() {
  background(200);
  for(var i=0;i<cells.length;i++){
    cells[i].move();
    cells[i].show();
  }
}
function mousePressed(){
  //this loop starts from back to avoid making duplicates
  for(var i=cells.length-1;i>=0;i--){
    if(cells[i].clicked(mouseX,mouseY))
    { 
     cells.push(cells[i].mitosis());
     cells.push(cells[i].mitosis());
     cells.splice(i,1);//to delete the old cell
    }
}
}

// sketch.js
let cols, rows;
let scale = 2; // pixel scale
let A, B, C;
let A2, B2, C2;

let DA = 1.0;
let DB = 0.5;
let DC = 0.2;

let k1 = 0.045;   // A + 2B -> 3B (B autocatalysis)
let k2 = 0.03;    // B + 2C -> 3C (C autocatalysis)
let f = 0.055;    // feed A
let decayB = 0.01;
let decayC = 0.01;

function setup() {
  createCanvas(600, 400);
  cols = floor(width / scale);
  rows = floor(height / scale);

  // allocate 2D arrays
  A = make2DArray(cols, rows);
  B = make2DArray(cols, rows);
  C = make2DArray(cols, rows);
  A2 = make2DArray(cols, rows);
  B2 = make2DArray(cols, rows);
  C2 = make2DArray(cols, rows);

  // initial conditions: A ~ 1, B & C ~ 0
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      A[x][y] = 1.0;
      B[x][y] = 0.0;
      C[x][y] = 0.0;
    }
  }

  // seed a small patch of B and C in the center
  seedSpot(cols/2 - 8, rows/2 - 8, 16, 16, 'B');
  seedSpot(cols/4 - 6, rows/4 - 6, 12, 12, 'C');

  frameRate(60);
  pixelDensity(1);
}

function draw() {
  // update multiple times per frame for stability if needed
  for (let it = 0; it < 2; it++) updateRD();

  // render
  loadPixels();
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      let i = (x + y * cols);
      // color mixing: map A,B,C to rgb for visualization
      let r = constrain( A[x][y] * 255, 0, 255);
      let g = constrain( B[x][y] * 255, 0, 255);
      let b = constrain( C[x][y] * 255, 0, 255);
      // upscale to canvas (scale x scale)
      for (let sx = 0; sx < scale; sx++) {
        for (let sy = 0; sy < scale; sy++) {
          let px = (x * scale + sx);
          let py = (y * scale + sy);
          let idx = 4 * (px + py * width);
          pixels[idx] = r;
          pixels[idx+1] = g;
          pixels[idx+2] = b;
          pixels[idx+3] = 255;
        }
      }
    }
  }
  updatePixels();
}

// Reaction-Diffusion update: Euler explicit
function updateRD() {
  // compute new fields into A2,B2,C2 using laplacian and reactions
  for (let x = 1; x < cols - 1; x++) {
    for (let y = 1; y < rows - 1; y++) {
      let a = A[x][y];
      let b = B[x][y];
      let c = C[x][y];

      let lapA = laplacian(A, x, y);
      let lapB = laplacian(B, x, y);
      let lapC = laplacian(C, x, y);

      // reaction terms
      let reactAB = k1 * a * b * b;    // consumes A, produces B
      let reactBC = k2 * b * c * c;    // consumes B, produces C

      // simple explicit update (dt ~ 1)
      let aNext = a + (DA * lapA - reactAB + f * (1 - a));
      let bNext = b + (DB * lapB + reactAB - reactBC - decayB * b);
      let cNext = c + (DC * lapC + reactBC - decayC * c);

      // clamp to [0,1.5] to avoid blow-up
      A2[x][y] = constrain(aNext, 0, 1.5);
      B2[x][y] = constrain(bNext, 0, 1.5);
      C2[x][y] = constrain(cNext, 0, 1.5);
    }
  }

  // swap arrays
  swapFields();
}

function swapFields() {
  let tmp;
  tmp = A; A = A2; A2 = tmp;
  tmp = B; B = B2; B2 = tmp;
  tmp = C; C = C2; C2 = tmp;
}

function laplacian(field, x, y) {
  // 5-point stencil
  return (
     field[x][y] * -1 +
     field[x - 1][y] * 0.2 +
     field[x + 1][y] * 0.2 +
     field[x][y - 1] * 0.2 +
     field[x][y + 1] * 0.2 +
     field[x - 1][y - 1] * 0.05 +
     field[x - 1][y + 1] * 0.05 +
     field[x + 1][y - 1] * 0.05 +
     field[x + 1][y + 1] * 0.05
  );
}

// utilities
function make2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < cols; i++) {
    arr[i] = new Array(rows).fill(0);
  }
  return arr;
}

function seedSpot(cx, cy, w, h, which) {
  for (let x = floor(cx); x < floor(cx + w); x++) {
    for (let y = floor(cy); y < floor(cy + h); y++) {
      if (x > 0 && x < cols && y > 0 && y < rows) {
        if (which === 'B') {
          B[x][y] = 1.0;
          A[x][y] = 0.5;
        } else if (which === 'C') {
          C[x][y] = 1.0;
          B[x][y] = 0.4;
        }
      }
    }
  }
}

// click to seed B
function mousePressed() {
  let gx = floor(mouseX / scale);
  let gy = floor(mouseY / scale);
  seedSpot(gx - 4, gy - 4, 8, 8, 'B');
}

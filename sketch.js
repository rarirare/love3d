let font;
let angle = 0;
let layerOffsets = [];
let numLayers = 25; // Number of layers for the extrusion effect
let hoverEffect = false;

function preload() {
  font = loadFont("https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf"); // Ensure the path is correct
}

function setup() {
  createCanvas(800, 600, WEBGL);
  textFont(font);
  textSize(100);
  textAlign(CENTER, CENTER);

  // Initialize offsets for layers
  for (let i = 0; i < numLayers; i++) {
    layerOffsets.push({ x: 0, y: 0, z: -i * 2 });
  }
}

function draw() {
  background(30);

  if (!hoverEffect) {
    // Reset offsets to original positions
    for (let i = 0; i < numLayers; i++) {
      layerOffsets[i].x = 0;
      layerOffsets[i].y = 0;
      layerOffsets[i].z = -i * 2;
    }
  }

  // Rotate the entire word
  rotateY(angle);
  rotateX(angle * 0.5);

  // Draw each layer
  for (let i = 0; i < numLayers; i++) {
    let offset = layerOffsets[i];
    push();
    translate(offset.x, offset.y, offset.z);
    fill(lerpColor(color(255, 0, 150), color(50), i / numLayers)); // Gradient effect
    text("LOVE", 0, 0);
    pop();
  }

  // Rotate animation
  if (!hoverEffect) {
    angle += 0.01;
  }
}

function mouseMoved() {
  // Check if the mouse is hovering over the word
  let d = dist(mouseX - width / 2, mouseY - height / 2, 0, 0);
  if (d < 150) { // Adjust the hover detection radius as needed
    hoverEffect = true;
    // Disassemble layers
    for (let i = 0; i < numLayers; i++) {
      layerOffsets[i].x = random(-200, 200);
      layerOffsets[i].y = random(-200, 200);
      layerOffsets[i].z = random(-200, 200);
    }
  } else {
    hoverEffect = false;
  }
}

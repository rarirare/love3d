let font;
let angle = 0;
let layerOffsets = [];
let numLayers = 25; // Number of layers for the extrusion effect
let handClosed = false;
let video;
let handsDetector;

function preload() {
  font = loadFont("https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf");
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

  // Set up video capture and hand detection
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handsDetector = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  handsDetector.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  handsDetector.onResults(onResults);

  const mpCamera = new Camera(video.elt, {
    onFrame: async () => {
      await handsDetector.send({ image: video.elt });
    },
    width: 640,
    height: 480,
  });

  mpCamera.start();
}

function onResults(results) {
  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    const hand = results.multiHandLandmarks[0];

    // Get thumb tip and index tip landmarks
    const thumbTip = hand[4];
    const indexTip = hand[8];

    // Calculate the distance between thumb tip and index tip
    const distance = dist(
      thumbTip.x * width,
      thumbTip.y * height,
      indexTip.x * width,
      indexTip.y * height
    );

    // If the distance is below a certain threshold, consider the hand closed
    handClosed = distance < 50; // Adjust threshold as needed
  } else {
    handClosed = false;
  }
}

function draw() {
  background(30);

  if (!handClosed) {
    // Reset offsets to original positions
    for (let i = 0; i < numLayers; i++) {
      layerOffsets[i].x = 0;
      layerOffsets[i].y = 0;
      layerOffsets[i].z = -i * 2;
    }
  } else {
    // Disassemble layers
    for (let i = 0; i < numLayers; i++) {
      layerOffsets[i].x = random(-200, 200);
      layerOffsets[i].y = random(-200, 200);
      layerOffsets[i].z = random(-200, 200);
    }
  }

  // Rotate the entire word
  rotateY(angle*0.7);
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
  if (!handClosed) {
    angle += 0.03;
  }
}


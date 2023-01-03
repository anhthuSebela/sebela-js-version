let sketch = function(p){
  let canvas;
  let dMouse = [];
  let closest;

  // overlay for camera
  p.setup = function() {
    canvas = p.createCanvas(640, 480); //1.375 w, 1.04 h
    canvas.id("canvas");
  }

  p.draw = function(){
    // p.clear is a p5 function that gives a transpaterent background to every frame
    p.clear();
    if(detections != undefined){
      // if it detects a face it returns the faceMesh function
      if(detections.multiFaceLandmarks != undefined && detections.multiFaceLandmarks.length >= 1){
        p.faceMesh();
      }
    }
  }

  // this function is called when the camera detects the face is what is drawn onto the face
  p.faceMesh = function(){
    let upperlip = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 306, 292, 415, 310, 311, 312, 13, 82, 81, 80, 191, 78, 62, 76, 61];
    let lowerlip = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 306, 292, 308, 324, 318,
      402, 317, 14, 87, 178, 88, 95, 78, 62, 76, 61]
    

        // Find the minimum and maximum x and y coordinates of the bounding box
    let minX = Number.MAX_VALUE;
    let topmostY = Number.MAX_VALUE; // Initialize topmostY to be the maximum possible value
    let minY = Number.MAX_VALUE;
    let maxX = 0;
    let maxY = 0;
    for (let j = 0; j < upperlip.length; j++) {
      let index = upperlip[j];
      let x = detections.multiFaceLandmarks[0][index].x * p.width;
      let y = detections.multiFaceLandmarks[0][index].y * p.height;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      topmostY = Math.min(topmostY, y); // Update topmostY if a smaller y-coordinate is encountered
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }
    for (let j = 0; j < lowerlip.length; j++) {
      let index = lowerlip[j];
      let x = detections.multiFaceLandmarks[0][index].x * p.width;
      let y = detections.multiFaceLandmarks[0][index].y * p.height;
      minX = Math.min(minX, x);
      topmostY = Math.min(topmostY, y); // Update topmostY if a smaller y-coordinate is encountered
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
    }

    // Initialize the total brightness to 0
    let totalBrightness = 0;

    // Iterate over the pixels in the bounding box
    for (let x = minX; x <= maxX; x++) {
      for (let y = minY; y <= maxY; y++) {
        // Get the brightness of the pixel
        let brightness = p.brightness(p.get(x, y));
        totalBrightness += brightness;
      }
    }

    

    // Calculate the average brightness
    let numPixels = (maxX - minX + 1) * (maxY - minY + 1);
    let averageBrightness = totalBrightness / numPixels;

    console.log(`Average brightness: ${averageBrightness}`);


    let color3 = p.color(176, 84, 79); // Dark color in RGB color model
    let color2 = p.color(185, 104, 99, 255); // Medium color in RGB color model //the fourth argument is tthe opacaity from 0-255
    let color1 = p.color(200, 135, 132); // Light color in RGB color model

    p.colorMode(p.RGB);
    p.noStroke();

    p.beginShape(p.LINE_LOOP);
    for(let j=0; j<upperlip.length; j++){
      let index = upperlip[j];
      let x = detections.multiFaceLandmarks[0][index].x * p.width;
      let y = detections.multiFaceLandmarks[0][index].y * p.height;

            // Adjust the values of topmostY and maxY to control the shape of the gradient
      let topmostY = minY + (maxY - minY) * 0.4;  // Start the gradient 30% down from the top of the bounding box
      let t1 = p.map(y, topmostY, maxY, 0, 1); // Calculate t based on the y coordinate of the vertex
      let t2 = p.lerp(0, 1, t1); // Interpolate between 0 and 1 based on t1
      let color;
      if (t2 < 0.5) {
        // Interpolate between color3 and color2 based on t2
        color = p.lerpColor(color3, color2, t2 * 2); 
      } else {
        // Interpolate between color2 and color1 based on t2
        color = p.lerpColor(color2, color1, (t2 - 0.5) * 2); 
      }
      p.fill(color); // Set the fill color for the current vertex
      p.vertex(x, y);
    }
    p.endShape();


    p.beginShape(p.LINE_LOOP);
    for(let j=0; j<lowerlip.length; j++){
      let index = lowerlip[j];
      let x = detections.multiFaceLandmarks[0][index].x * p.width;
      let y = detections.multiFaceLandmarks[0][index].y * p.height;
      // Calculate the color for the current vertex based on its y coordinate
      let t = p.map(y, topmostY, maxY, 0, 1); // Calculate t based on the y coordinate of the vertex
      let color = p.lerpColor(color3, color2, t); // Interpolate between color3 and color1 based on t
      p.fill(color); // Set the fill color for the current vertex
      p.vertex(x, y);;
    }
    p.endShape();

    console.log(`Bounding box: (${minX}, ${minY}) to (${maxX}, ${maxY})`);
  }
}

let myp5 = new p5(sketch);
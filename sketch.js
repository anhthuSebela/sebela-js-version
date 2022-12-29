let sketch = function(p){
  let canvas;
  let dMouse = [];
  let closest;

  p.setup = function(){
    canvas = p.createCanvas(640, 480);
    canvas.id("canvas");
    p.colorMode(p.HSB);

    p.stroke(25);
    p.strokeWeight(3);
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
      
    p.beginShape(p.POINTS);
    for(let j=0; j<detections.multiFaceLandmarks[0].length; j++){
      let x = detections.multiFaceLandmarks[0][j].x * p.width;
      let y = detections.multiFaceLandmarks[0][j].y * p.height;
      p.vertex(x, y);
    }
    p.endShape();
  }
}

let myp5 = new p5(sketch);
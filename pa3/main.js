
var currentlyPressedKeys = {};
var gl = null;

var cube = new Cube();
var floor = new Floor();
var tree = new Tree();
var snows = [];
var star = new Star();

var particles = 400; 
var eyeX = 0;
var eyeY = 20; 
var eyeZ = 16;

var frames = 0;

var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function getRandom(min, max) {
  min = Number(min);
  max = Number(max);
  return Math.random() * (max - min) + min; 
}

function mvPushMatrix() {
  var copy = mat4.create();
  mat4.set(mvMatrix, copy);
  mvMatrixStack.push(copy);
}

function mvPopMatrix() {
  if (mvMatrixStack.length == 0) {
    throw "Invalid popMatrix!";
  }
  mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

  var normalMatrix = mat4.create();
  mat4.invert(normalMatrix, mvMatrix);
  normalMatrix = mat3.fromMat4(mat3.create(), normalMatrix);
  mat3.transpose(normalMatrix, normalMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);
}


function degToRad(degrees) {
  return degrees * Math.PI / 180;
}



var xRot = 0;
var xSpeed = 3;

var yRot = 0;
var ySpeed = -3;

var z = -5;



function handleKeyDown(event) {
  currentlyPressedKeys[event.keyCode] = true;
}


function handleKeyUp(event) {
  currentlyPressedKeys[event.keyCode] = false;
}


function handleKeys() {
  if (currentlyPressedKeys[33]) {
    // Page Up
    z -= 0.05;
  }
  if (currentlyPressedKeys[34]) {
    // Page Down
    z += 0.05;
  }
  if (currentlyPressedKeys[37]) {
    // Left cursor key
    ySpeed -= 1;
  }
  if (currentlyPressedKeys[39]) {
    // Right cursor key
    ySpeed += 1;
  }
  if (currentlyPressedKeys[38]) {
    // Up cursor key
    xSpeed -= 1;
  }
  if (currentlyPressedKeys[40]) {
    // Down cursor key
    xSpeed += 1;
  }


  if (currentlyPressedKeys[37] || currentlyPressedKeys[65]) {
    eyeX -= 0.5;
  } else if (currentlyPressedKeys[39] || currentlyPressedKeys[68]) {
    eyeX += 0.5;
  }

  if (currentlyPressedKeys[38] || currentlyPressedKeys[87]) {
    // Up cursor key or W
    eyeY += 0.5;
  } else if (currentlyPressedKeys[40] || currentlyPressedKeys[83]) {
    // Down cursor key
    eyeY -= 0.5;
  } 
}




function drawScene() {
  frames++;
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var useTexture = document.getElementById("texture").checked;
  gl.uniform1i(shaderProgram.useTexture, useTexture);

  var useSpecularMap = document.getElementById("specular-map").checked;
  gl.uniform1i(shaderProgram.useSpecularMapUniform, useSpecularMap);

  var lighting = document.getElementById("lighting").checked;
  gl.uniform1i(shaderProgram.useLightingUniform, lighting);
  if (lighting) {
    gl.uniform3f(
      shaderProgram.ambientColorUniform,
      parseFloat(document.getElementById("ambientR").value),
      parseFloat(document.getElementById("ambientG").value),
      parseFloat(document.getElementById("ambientB").value)
    );

    gl.uniform3f(
      shaderProgram.pointLightingLocationUniform,
      parseFloat(document.getElementById("lightPositionX").value),
      parseFloat(document.getElementById("lightPositionY").value),
      parseFloat(document.getElementById("lightPositionZ").value)
    );

    gl.uniform3f(
      shaderProgram.pointLightingSpecularColorUniform,
      parseFloat(document.getElementById("specularR").value),
      parseFloat(document.getElementById("specularG").value),
      parseFloat(document.getElementById("specularB").value)
    );

    gl.uniform3f(
      shaderProgram.pointLightingDiffuseColorUniform,
      parseFloat(document.getElementById("diffuseR").value),
      parseFloat(document.getElementById("diffuseG").value),
      parseFloat(document.getElementById("diffuseB").value)
    );
  }
  mat4.perspective(pMatrix, degToRad(60), gl.viewportWidth / gl.viewportHeight, 0.01, 100.0);

  eyeY = 3 + 1 * Math.sin(Math.PI / 180 * frames / 5);
  eyeZ = 5 + 1 * Math.cos(Math.PI / 180 * frames / 2);

  //cube.draw(lookAt); 
  //lookAt = mat4.lookAt(mat4.create(), [0, 1, 5], [0, 0, 0], [0, 1, 0]);

  var lookAt = mat4.lookAt(mat4.create(), [eyeX, eyeY, eyeZ], [0, 0, 0], [0, 1, 0]);
  floor.draw(lookAt);


  for(var i=0; i<snows.length; i++){
    snows[i].update(document.getElementById("wind").value);
    snows[i].draw(lookAt);
  } 

  for(var i=0; i<snows.length; ){
    if(snows[i].alpha <= 0.0){
      snows.splice(i, 1);
    }
    else{
      i++;
    }
  } 

  //particles = getRandom(
      //document.getElementById("particles_begin").value, 
      //document.getElementById("particles_end").value);
      
  for(var i=0; i<particles - snows.length; i++){
    console.log("생성");
    var newSnow = new Tetra();
    newSnow.makeBuffer();
    newSnow.loadTexture();
    snows.push(newSnow);
  }
  tree.draw(lookAt);

  star.draw(lookAt);

}


var lastTime = 0;

function animate() {
  var timeNow = new Date().getTime();
  if (lastTime != 0) {
    var elapsed = timeNow - lastTime;

    xRot += (xSpeed * elapsed) / 1000.0;
    yRot += (ySpeed * elapsed) / 1000.0;
  }
  lastTime = timeNow;
}


function tick() {
  requestAnimFrame(tick);
  handleKeys();
  drawScene();
  animate();
}


function webGLStart() {
  var canvas = document.getElementById("lesson07-canvas");
  initGL(canvas);
  initShaders();


  cube.makeBuffer();
  cube.loadTexture();

  floor.makeBuffer();
  floor.loadTexture();

  tree.makeBuffer();
  tree.loadTexture();

  star.makeBuffer();
  star.loadTexture();

  for(var i=0; i<particles; i++){

    var snow = new Tetra();
    snow.makeBuffer();
    snow.loadTexture();
    snows.push(snow);
    //snow.x = getRandom(-3, 3);
    //snow.y = getRandom(4, 6); // 5 + -1 + Math.random() * 2; 
    //snow.vy = getRandom(-0.008, -0.01);
    //snow.vx = getRandom(-0.005, 0.005);

    //snow.x = -1 + Math.random() * 2;
    //snow.y = 5 + -1 + Math.random() * 2; 
    //console.log(snow.x, snow.y);
  }



  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  document.onkeydown = handleKeyDown;
  document.onkeyup = handleKeyUp;

  tick();
}

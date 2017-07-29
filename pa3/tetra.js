
function Tetra(){

  this.cubeVertexPositionBuffer = [];
  this.cubeVertexIndexBuffer = [];
  this.cubeVertexNormalBuffer = [];
  this.cubeVertexTextureCoordBuffer = [];
  this.texture = null;
  this.geometry = null;
  //this.x = 0;
  //this.y = 0;
  //this.vy = -0.01;
  //this.vx = 0;
  this.x = getRandom(-3, 3);
  this.y = getRandom(3, 15); // 5 + -1 + Math.random() * 2; 
  this.z = getRandom(-10, 4);
  this.vy = getRandom(-0.008, -0.01);
  this.vx = getRandom(-0.005, 0.005);
  this.alpha = 0.4;
  this.axisX = getRandom(-1, 1);
  this.axisY = getRandom(-1, 1);
  this.axisZ = getRandom(-1, 1);
  
  this.handleLoadedTexture = function(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);
  };
  this.loadTexture = function(){ 
    this.texture = gl.createTexture();
    this.texture.image = new Image();
    var _this = this;
    this.texture.image.onload = function () {
      _this.handleLoadedTexture(_this.texture)
    } 
    this.texture.image.src = "Ice.bmp";
  };

  this.makeBuffer = function(){
    var latitudeBands = 20;
    var longitudeBands = 20;
    var radius = 0.3;
    var vertexPositionData = [];
    var normalData = [];
    var textureCoordData = [];
    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
      var theta = latNumber * Math.PI / latitudeBands;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudeBands;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / longitudeBands);
        var v = 1 - (latNumber / latitudeBands);

        normalData.push(x);
        normalData.push(y);
        normalData.push(z);
        textureCoordData.push(u);
        textureCoordData.push(v);
        vertexPositionData.push(radius * x);
        vertexPositionData.push(radius * y);
        vertexPositionData.push(radius * z);
      }
    }

    var indexData = [];
    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
      for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
        var first = (latNumber * (longitudeBands + 1)) + longNumber;
        var second = first + longitudeBands + 1;
        indexData.push(first);
        indexData.push(second);
        indexData.push(first + 1);

        indexData.push(second);
        indexData.push(second + 1);
        indexData.push(first + 1);
      }
    }

    this.cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);

    vertices = vertexPositionData;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.cubeVertexPositionBuffer.itemSize = 3;
    this.cubeVertexPositionBuffer.numItems = vertexPositionData.length / 3;

    this.cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    var vertexNormals = normalData;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    this.cubeVertexNormalBuffer.itemSize = 3;
    this.cubeVertexNormalBuffer.numItems = normalData.length / 3;

    this.cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    var textureCoords = textureCoordData;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    this.cubeVertexTextureCoordBuffer.itemSize = 2;
    this.cubeVertexTextureCoordBuffer.numItems = textureCoordData.length / 2;



    this.cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), gl.STREAM_DRAW);
    this.cubeVertexIndexBuffer.itemSize = 1;
    this.cubeVertexIndexBuffer.numItems = indexData.length; 
  };
  this.update = function(windValue){ 
    //modelViewMatrix = lookAt(eye, at , up);
    this.y += this.vy  * getRandom(0.8, 1.2);

    //console.log(windValue/1000);

    if(this.y <= 0){
      this.y = 0;
      this.alpha -= 0.015/3;
    }
    else{
      this.x += this.vx * getRandom(0.8, 1.2);
      this.x += windValue/1000;
    }
  };
  this.deg = 0;
  this.draw = function(lookAt){
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    mat4.identity(mvMatrix);

    //mvMatrix = lookAt;
    //mat4.rotate(mvMatrix, mvMatrix, degToRad(this.deg), [0, 1, 0]);
    mat4.translate(mvMatrix, mvMatrix, [this.x, this.y, this.z]);
    mat4.scale(mvMatrix, mvMatrix, [0.3, 0.3, 0.3]);
    if(this.y > 0){
      this.deg+=1;
      mat4.rotate(mvMatrix, mvMatrix, degToRad(this.deg), [this.axisX, this.axisY, this.axisZ]);
    }

    mat4.multiply(mvMatrix, lookAt, mvMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0); 

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.colorMapSamplerUniform, 0);
    gl.uniform1i(shaderProgram.transparency, 1);
    gl.uniform1f(shaderProgram.alphaUniform, this.alpha);

    setMatrixUniforms();

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
    gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
    //for(var i=0; i<this.cubeVertexPositionBuffer.numItems; i++){
      //gl.drawArrays(gl.TRIANGLES, i, 3);
    //}
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.bindTexture(gl.TEXTURE_2D, null); 

  };



};

function Star(){

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
  this.x = 0;
  this.y = 2.0;
  this.z = 0;
  
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
    //this.texture.image.src = "star.jpg";
    //this.texture.image.src = "Snow.bmp";
    this.texture.image.src = "star.bmp";
  };

  this.makeBuffer = function(){

    this.cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);

    vertices = [
      // Front face
      -1.0, -1.0,  0.0,
      -1.0,  1.0,  0.0,
      1.0, -1.0,  0.0,

      -1.0,  1.0,  0.0,
      1.0, -1.0,  0.0,
      1.0,  1.0,  0.0, 
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.cubeVertexPositionBuffer.itemSize = 3;
    this.cubeVertexPositionBuffer.numItems = 6;

    this.cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    var vertexNormals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    this.cubeVertexNormalBuffer.itemSize = 3;
    this.cubeVertexNormalBuffer.numItems = 6;

    this.cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    var textureCoords = [
      0,0,
      0, 1,
      1, 0,

      0, 1,
      1, 0,
      1, 1
    ] ;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    this.cubeVertexTextureCoordBuffer.itemSize = 2;
    this.cubeVertexTextureCoordBuffer.numItems = 6;


  };
  this.update = function(windValue){ 
  };
  this.deg = 0;
  this.draw = function(lookAt){
    gl.enable(gl.DEPTH_TEST);
    mat4.identity(mvMatrix);

    //mvMatrix = lookAt;
    //mat4.rotate(mvMatrix, mvMatrix, degToRad(this.deg), [0, 1, 0]);
    mat4.translate(mvMatrix, mvMatrix, [this.x, this.y, this.z]);
    mat4.scale(mvMatrix, mvMatrix, [0.3, 0.3, 0.3]);

    mat4.multiply(mvMatrix, lookAt, mvMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.cubeVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.cubeVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0); 

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.colorMapSamplerUniform, 1);
    gl.uniform1i(shaderProgram.transparency, 1);
    gl.uniform1f(shaderProgram.alphaUniform, 1);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);

    setMatrixUniforms();

    for(var i=0; i<this.cubeVertexPositionBuffer.numItems; i+=3){
      gl.drawArrays(gl.TRIANGLES, i, 3);
    }

  };



};

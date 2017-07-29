function Floor(){

  this.vertexPositionBuffer = [];
  this.vertexIndexBuffer = [];
  this.vertexNormalBuffer = [];
  this.vertexTextureCoordBuffer = [];
  this.texture = null;
  this.geometry = null;
  
  this.handleLoadedTexture = function(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, 
      gl.UNSIGNED_BYTE, texture.image);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); 
    gl.bindTexture(gl.TEXTURE_2D, null); 
    //gl.activeTexture(gl.TEXTURE0);
    //gl.bindTexture(gl.TEXTURE_2D, texture);
    //gl.uniform1i(shaderProgram.colorMapSamplerUniform, 0); 
    //gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); 

  };
  this.loadTexture = function(){ 
    this.texture = gl.createTexture();
    this.texture.image = new Image();
    var _this = this;
    this.texture.image.onload = function () {
      _this.handleLoadedTexture(_this.texture)
    } 
    //this.texture.image.src = "earth.jpg";
    this.texture.image.src = "Snowman_1.bmp";
  };
  this.makeBuffer = function(){
    //var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );

    //var geometry = new THREE.ConeBufferGeometry( 5, 20, 32 );

    var geometry = new THREE.TetrahedronBufferGeometry(0.3, 0);

    //var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 );
    //var geometry = new THREE.ConeBufferGeometry( 5/5, 20/5, 32/5 );

    //var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
    //TetrahedronBufferGeometry(radius, detail)

    var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var cube2 = new THREE.Mesh( geometry, material );
    this.geometry = cube2.geometry; 
    this.vertexPositionBuffer = gl.createBuffer();
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = 6;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer); 
    vertices = cube2.geometry.attributes.position.array;
    var vertices = 
      [-1, 0, -1,
        -1, 0, 1, 
        1, 0, 1,

        -1, 0, -1,
        1, 0, 1,
        1, 0, -1];


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); 
    this.vertexNormalBuffer = gl.createBuffer();
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = 6;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    var vertexNormals = 
      [0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0,
        0, 1, 0];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

    this.vertexTextureCoordBuffer = gl.createBuffer();
    this.vertexTextureCoordBuffer.itemSize = 2;
    this.vertexTextureCoordBuffer.numItems = 6;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
    var textureCoords = 
      [0, 1,
        0, 0,
        1, 0,

        0, 1,
        1, 0,
        1, 1]; 

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);


  };
  this.update = function(){ 
    //modelViewMatrix = lookAt(eye, at , up);
  };
  this.deg = 0;
  this.draw = function(lookAt){
    gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
    gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
    mat4.identity(mvMatrix);

    this.deg += 1;
    mat4.scale(mvMatrix, mvMatrix, [

      parseFloat(document.getElementById("scale").value),
      parseFloat(document.getElementById("scale").value),
      parseFloat(document.getElementById("scale").value),
    ] );
    //mat4.rotate(mvMatrix, mvMatrix, degToRad(this.deg), [0, 1, 0]);
    mat4.scale(mvMatrix, mvMatrix, [5, 5, 5]);

    mat4.multiply(mvMatrix, lookAt, mvMatrix);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0); 

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.colorMapSamplerUniform, 0);
    gl.uniform1f(shaderProgram.alphaUniform, 1.0);
    gl.uniform1f(shaderProgram.transparency, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.drawArrays(gl.TRIANGLES, 3, 3); 
  }; 
};

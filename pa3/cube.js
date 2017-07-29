function Cube(){

  this.cubeVertexPositionBuffer = [];
  this.cubeVertexIndexBuffer = [];
  this.cubeVertexNormalBuffer = [];
  this.cubeVertexTextureCoordBuffer = [];
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
    console.log("load end");
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
    this.texture.image.src = "crate.gif";
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
    this.cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);

    vertices = cube2.geometry.attributes.position.array;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.cubeVertexPositionBuffer.itemSize = cube2.geometry.attributes.position.itemSize;
    this.cubeVertexPositionBuffer.numItems = cube2.geometry.attributes.position.count;

    this.cubeVertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexNormalBuffer);
    var vertexNormals = cube2.geometry.attributes.normal.array;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
    this.cubeVertexNormalBuffer.itemSize = cube2.geometry.attributes.normal.itemSize;
    this.cubeVertexNormalBuffer.numItems = cube2.geometry.attributes.normal.count;

    this.cubeVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexTextureCoordBuffer);
    var textureCoords = cube2.geometry.attributes.uv.array;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    this.cubeVertexTextureCoordBuffer.itemSize = cube2.geometry.attributes.uv.itemSize;
    this.cubeVertexTextureCoordBuffer.numItems = cube2.geometry.attributes.uv.count;



    //gl.activeTexture(gl.TEXTURE1);
    //gl.bindTexture(gl.TEXTURE_2D, earthSpecularMapTexture);
    //gl.uniform1i(shaderProgram.specularMapSamplerUniform, 1);
    if(cube2.geometry.index != null){
      this.cubeVertexIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
      var cubeVertexIndices = cube2.geometry.index.array;
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
      this.cubeVertexIndexBuffer.itemSize = cube2.geometry.index.itemSize;
      this.cubeVertexIndexBuffer.numItems = cube2.geometry.index.count;
    }
  };
  this.update = function(){ 
    //modelViewMatrix = lookAt(eye, at , up);
  };
  this.deg = 0;
  this.draw = function(lookAt){
    mat4.identity(mvMatrix);

    //mvMatrix = lookAt;
    this.deg+=1;
    //mat4.rotate(mvMatrix, mvMatrix, degToRad(this.deg), [0, 1, 0]);
    mat4.translate(mvMatrix, mvMatrix, [-2, 0.0, 0]);
    //mat4.rotate(mvMatrix, mvMatrix, degToRad(this.deg), [0, 1, 0]);

    mat4.rotate(mvMatrix, mvMatrix, degToRad(xRot), [1, 0, 0]);
    mat4.rotate(mvMatrix, mvMatrix, degToRad(this.deg), [0, 1, 0]);

    gl.uniform1i(shaderProgram.useColorMapUniform, 1);

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

    setMatrixUniforms();

    if(this.geometry.index != null){
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);
      gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0); 
    }
    else{
      for(var i=0; i<this.cubeVertexPositionBuffer.numItems; i+=3){
        //gl.drawArrays(gl.TRIANGLES, i, 3);
      }
    }

  };



};

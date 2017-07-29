function Snow(){

  this.vertexPositionBuffer = [];
  this.vertexIndexBuffer = [];
  this.vertexNormalBuffer = [];
  this.vertexTextureCoordBuffer = [];
  this.texture = null;
  this.geometry = null;
  this.x = 0;
  this.y = 0;
  
  this.handleLoadedTexture = function(texture) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); 

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, 
      gl.UNSIGNED_BYTE, texture.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); 
    console.log("load end");
    gl.activeTexture(gl.TEXTURE0);
    //gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(shaderProgram.colorMapSamplerUniform, 0); 
    //gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0); 
    gl.bindTexture(gl.TEXTURE_2D, null); 

  };
  this.loadTexture = function(){ 
    this.texture = gl.createTexture();
    this.texture.image = new Image();
    var _this = this;
    this.texture.image.onload = function () {
      _this.handleLoadedTexture(_this.texture)
    } 
    //this.texture.image.src = "earth.jpg";
    this.texture.image.src = "Snow.bmp";
  };
  this.makeNormals = function(bbul, bases) {
    var normals = [];
    for(var i=0; i<bases.length - 1; i++){
      var v1, v2;
      v1 = vec3.create();
      v2 = vec3.create();
      vec3.subtract(v1, 
        vec3.fromValues(bases[i][0], bases[i][1], bases[i][2]),
        vec3.fromValues(bbul[0], bbul[1], bbul[2])
      );
      vec3.subtract(v2, 
        vec3.fromValues(bases[i+1][0], bases[i+1][1], bases[i+1][2]),
        vec3.fromValues(bases[i][0], bases[i][1], bases[i][2])
      );
      var normal = vec3.create();
      vec3.cross(normal, v1, v2);
      for(var j=0; j<3; j++){
        normals.push(normal[0]);
        normals.push(normal[1]);
        normals.push(normal[2]);
      } 
    }
    return normals;
  }
  this.makeBuffer = function(){
    //var geometry = new THREE.BoxBufferGeometry( 1, 1, 1 ); 
    //var geometry = new THREE.ConeBufferGeometry( 5, 20, 32 ); 
    var n = 10;
    var bases = [];
    for(var i = 0; i<n; i++){

      var y = Math.sin(i * 2 * Math.PI / n);
      var x = Math.cos(i * 2 * Math.PI / n);

      bases.push([x, 0, y]);
    }
    bases.push([bases[0][0], bases[0][1],  bases[0][2]]); 
    var vertices = [];
    for(var i=0; i<bases.length - 1; i++){
      vertices.push(0);
      vertices.push(2);
      vertices.push(0);

      // i, i+1 
      vertices.push(bases[i][0]);
      vertices.push(bases[i][1]);
      vertices.push(bases[i][2]);

      vertices.push(bases[i + 1][0]);
      vertices.push(bases[i + 1][1]);
      vertices.push(bases[i + 1][2]); 
    }

    this.vertexPositionBuffer = gl.createBuffer();
    this.vertexPositionBuffer.itemSize = 3;
    this.vertexPositionBuffer.numItems = vertices.length / 3;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW); 

    this.vertexNormalBuffer = gl.createBuffer()
    var normals = this.makeNormals([0, 2, 0], bases);

    console.log(vertices.length, normals.length);
    console.log(normals);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW); 
    this.vertexNormalBuffer.itemSize = 3;
    this.vertexNormalBuffer.numItems = (normals.length)/ 3; 


    this.vertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
    var textureCoords = [];
    for(var i=0; i<vertices.length / 3; i++){
      textureCoords.push(0.5);
      textureCoords.push(0.5);

      textureCoords.push(0.0);
      textureCoords.push(0.2);

      textureCoords.push(1.0);
      textureCoords.push(0.2);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    this.vertexTextureCoordBuffer.itemSize = 2;
    this.vertexTextureCoordBuffer.numItems = textureCoords.length / 2;





  };

  this.update = function(){ 
    //modelViewMatrix = lookAt(eye, at , up);
  };
  this.deg = 0;
  this.draw = function(lookAt){
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    mat4.identity(mvMatrix);

    //mvMatrix = lookAt;
    this.deg += 1;
    //mat4.rotate(mvMatrix, mvMatrix, degToRad(this.deg), [0, 1, 0]);
    mat4.translate(mvMatrix, mvMatrix, [this.x, this.y, 3]);

    mat4.multiply(mvMatrix, lookAt, mvMatrix);


    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, this.vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, this.vertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0); 

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.uniform1i(shaderProgram.colorMapSamplerUniform, 0);

    setMatrixUniforms();
    for(var i=0; i<this.vertexPositionBuffer.numItems/3; i++){
      gl.drawArrays(gl.TRIANGLES, i*3, 3);
    }
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);


  };



};

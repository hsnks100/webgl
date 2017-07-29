function Pyramid(){

  this.slope = 90;
  this.pyramidVertexPositionBuffer = [];
  //this.pyramidVertexIndexBuffer = [];
  //this.pyramidNormalBuffer = [];
  this.pyramidVertexColorBuffer = [];
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.scale = 1.0;
  this.jaJeonRad = 0;
  this.userRad = 0;
  
  this.makepyramidNormals = function(vertices) {
    var normals = [];
    for(var i=0; i<6*12; i+=12){//한 면에 하나의 법선벡터 계산
      var t1 = subtract(vec3(vertices[i+3], vertices[i+4], vertices[i+5]), vec3(vertices[i], vertices[i+1], vertices[i+2]));
      var t2 = subtract(vec3(vertices[i+6], vertices[i+7], vertices[i+8]), vec3(vertices[i+3], vertices[i+4], vertices[i+5]));
      var normal = cross(t1, t2);
      for(var j=0; j<4; j++)
        normals.push(vec3(normal));
    }
    return normals;
  };
  this.makeBuffer = function(){

    this.pyramidVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexPositionBuffer);

    var vertices = [
            // Front face
             0.0,  1.0,  0.0,
            -1.0, -1.0,  1.0,
             1.0, -1.0,  1.0,

            // Right face
             0.0,  1.0,  0.0,
             1.0, -1.0,  1.0,
             1.0, -1.0, -1.0,

            // Back face
             0.0,  1.0,  0.0,
             1.0, -1.0, -1.0,
            -1.0, -1.0, -1.0,

            // Left face
             0.0,  1.0,  0.0,
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0
    ];
        
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.pyramidVertexPositionBuffer.itemSize = 3;
    this.pyramidVertexPositionBuffer.numItems = 12;

    this.pyramidVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexColorBuffer);

    var colors = [
            // Front face
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            // Right face
            1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,

            // Back face
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            // Left face
            1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0
    ];
	
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    this.pyramidVertexColorBuffer.itemSize = 4;
    this.pyramidVertexColorBuffer.numItems = 12;

  };
  this.update = function(){ 
    //modelViewMatrix = lookAt(eye, at , up);
  };
  this.makeCubeNormals = function(vertices) {
    var normals = [];
    for(var i=0; i<6*12; i+=12){//한 면에 하나의 법선벡터 계산
      var t1 = subtract(vec3(vertices[i+3], vertices[i+4], vertices[i+5]), vec3(vertices[i], vertices[i+1], vertices[i+2]));
      var t2 = subtract(vec3(vertices[i+6], vertices[i+7], vertices[i+8]), vec3(vertices[i+3], vertices[i+4], vertices[i+5]));
      var normal = cross(t1, t2);
      for(var j=0; j<4; j++)
        normals.push(vec3(normal));
    }
    return normals;
  };
  this.draw = function(lookAt, earth){ 

    modelViewMatrix = mat4();
    modelViewMatrix = mult(modelViewMatrix, translate(earth.x, earth.y, earth.z));

    //this.slope = 180;
    //this.slope = 145;
    //console.log("slope = ", this.slope);
    //var axis = mult(rotate(this.slope, [0, 0, 1]), vec4(0, 1, 0, 1));
    //console.log(axis);
    //modelViewMatrix = mult(modelViewMatrix, rotate(this.jaJeonRad, [1, 0, 0]));
    //modelViewMatrix = mult(modelViewMatrix, rotate(this.jaJeonRad, [Math.cos(this.slope * 3.14 / 180), Math.sin(this.slope * 3.14 / 180), 0]));
    modelViewMatrix = mult(modelViewMatrix, rotate(this.jaJeonRad, [0, 1, 0]));
    //modelViewMatrix = mult(modelViewMatrix, rotate(this.jaJeonRad, [axis[0], axis[1], axis[2]]));
    modelViewMatrix = mult(modelViewMatrix, translate(2, 0, 0));
    //modelViewMatrix = mult(modelViewMatrix,translate(this.x, this.y, this.z));
    modelViewMatrix = mult(modelViewMatrix, rotate(this.jaJeonRad, [0, 1, 0]));
    modelViewMatrix = mult(modelViewMatrix, scale3(this.scale,this.scale,this.scale)); 
    normalMatrix = [
      vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
      vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
      vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    uLookAtMatrix = lookAt;

    var pos = mult(modelViewMatrix, vec4(0, 0, 0, 1));
    this.x = pos[0];
    this.y = pos[1];
    this.z = pos[2];

    ///////////////////////////////////////////////////

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix4fv(uLookAtMatrixLoc, false, flatten(uLookAtMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.pyramidVertexPositionBuffer);
    gl.vertexAttribPointer(vPosition, this.pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(vPosition);
    gl.drawArrays(gl.TRIANGLES, 0, this.pyramidVertexPositionBuffer.numItems);
  };



};

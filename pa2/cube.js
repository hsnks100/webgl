function Cube(){

  this.cubeVertexPositionBuffer = [];
  this.cubeVertexIndexBuffer = [];
  this.cubeNormalBuffer = [];
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.scale = 1.0;
  this.jaJeonRad = 0;
  this.userRad = 0;
  
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
  this.makeBuffer = function(){

    this.cubeVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
    var vertices = [
      // Front face
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
      1.0,  1.0,  1.0,
      1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0,  1.0,
      -1.0, -1.0,  1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0,  1.0,  1.0,
      1.0, -1.0,  1.0,

      // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0
    ];


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.cubeVertexPositionBuffer.itemSize = 3;
    this.cubeVertexPositionBuffer.numItems = 24;

    this.cubeVertexIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);

    var cubeVertexIndices = [
      0, 1, 2,      0, 2, 3,    // Front face
      4, 5, 6,      4, 6, 7,    // Back face
      8, 9, 10,     8, 10, 11,  // Top face
      12, 13, 14,   12, 14, 15, // Bottom face
      16, 17, 18,   16, 18, 19, // Right face
      20, 21, 22,   20, 22, 23  // Left face
    ];

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
    this.cubeVertexIndexBuffer.itemSize = 1;
    this.cubeVertexIndexBuffer.numItems = 36;

    //for normal vector of cube face
    this.cubeNormalBuffer  = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flatten(this.makeCubeNormals(vertices))), gl.STATIC_DRAW);
    this.cubeNormalBuffer.itemSize = 3;
    this.cubeNormalBuffer.numItems = 24;
  };
  this.update = function(){ 
    //modelViewMatrix = lookAt(eye, at , up);
  };



};


function Satel(){ };
Satel.prototype = new Tetra();
Satel.prototype.slope = 90;
Satel.prototype.draw = function(lookAt, earth){
  // 180 -> 30 / 180 => 1/6 도씩
  this.slope += 1/6;
  if(this.slope >= 360){
    this.slope -= 360;
  }

  modelViewMatrix = mat4();
  modelViewMatrix = mult(modelViewMatrix, translate(earth.x, earth.y, earth.z)); 
  modelViewMatrix = mult(modelViewMatrix, rotate(this.jaJeonRad, [0, 1, 0]));
  modelViewMatrix = mult(modelViewMatrix, translate(2, 0, 0));
  modelViewMatrix = mult(modelViewMatrix, rotate(this.jaJeonRad, [0, 1, 0]));
  modelViewMatrix = mult(modelViewMatrix, scale3(this.scale,this.scale,this.scale)); 
  normalMatrix = [
    vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
    vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
    vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
  ];


  var pos = mult(modelViewMatrix, vec4(0, 0, 0, 1));
  console.log(pos);
  this.x = pos[0];
  this.y = pos[1];
  this.z = pos[2];

  uLookAtMatrix = lookAt;

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
  gl.uniformMatrix4fv(uLookAtMatrixLoc, false, flatten(uLookAtMatrix) );
  gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

  var nBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
  gl.bufferData( gl.ARRAY_BUFFER, flatten(this.normalsArray), gl.STATIC_DRAW );

  var vNormal = gl.getAttribLocation( program, "vNormal" );
  gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal);


  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(this.pointsArray), gl.STATIC_DRAW);

  //console.log("normal", length(this.normalsArray));
  //console.log("points", length(this.pointsArray));

  var vPosition = gl.getAttribLocation( program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  for( var i=0; i<this.index; i+=3) 
    gl.drawArrays( gl.TRIANGLES, i, 3 ); 
};


function Earth(){ };
Earth.prototype = new Cube();
Earth.prototype.days = 1;
Earth.prototype.draw = function(lookAt){ 
  var vNormal = gl.getAttribLocation( program, "vNormal" );
  gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vNormal);

  var vPosition = gl.getAttribLocation( program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  var T = mat4();
  T = mult(T, rotate(this.jaJeonRad / 4, [0, 1, 0]));
  T = mult(T, translate(5, 0, 0));
  T = mult(T, scale3(this.scale,this.scale,this.scale)); 
  T = mult(T, rotate(this.jaJeonRad, [Math.cos(75 * 3.14 / 180), Math.sin(75 * 3.14 / 180), 0]));

  var coord = mult(T, vec4(0, 0, 0, 1));
  this.x = coord[0];
  this.y = coord[1];
  this.z = coord[2];
  modelViewMatrix = T;

  uLookAtMatrix = lookAt;

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
  gl.uniformMatrix4fv(uLookAtMatrixLoc, false, flatten(uLookAtMatrix) );
  //gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeVertexPositionBuffer);
  gl.vertexAttribPointer(vPosition, this.cubeVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, this.cubeNormalBuffer);
  gl.vertexAttribPointer(vNormal, this.cubeNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.cubeVertexIndexBuffer);


  gl.drawElements(gl.TRIANGLES, this.cubeVertexIndexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
};

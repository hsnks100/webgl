
var program;
var canvas;
var gl;
var isRun = false;
var viewToggle = false;

var numTimesToSubdivide = 3;

var index = 0; 

var pointsArray = [];
var normalsArray = [];

var eyeDistance = 19;

var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;


var lightPosition = vec4(0.0, 1.0, 20, 0.0 );
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 20.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc, uLookAtMatrixLoc;
var normalMatrix, normalMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

var sun = new Sun();
var earth = new Earth(); 
var myungWang = new Myung(); 
var satel = new Pyramid();
satel.jaJeonRad = 90;


window.onload = function init() {

  canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );


  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );


  ambientProduct = mult(lightAmbient, materialAmbient);
  diffuseProduct = mult(lightDiffuse, materialDiffuse);
  specularProduct = mult(lightSpecular, materialSpecular);


  //console.log(cube);
  earth.makeBuffer();
  earth.x = 3.0;
  earth.y = 0;
  earth.z = 0;
  earth.scale = 0.4;

  sun.tetrahedron(5);
  sun.x = sun.y = sun.z = 0;

  myungWang.tetrahedron(1);
  myungWang.x = 5;
  myungWang.y = myungWang.z = 0;

  //satel.tetrahedron(2);
  satel.makeBuffer();
  satel.scale = 0.3;
  
  myungWang.x = 11 * Math.cos(-myungWang.userRad * 3.14 / 180);
  myungWang.z = 6 * Math.sin(-myungWang.userRad * 3.14 / 180);
  //pyr.makeBuffer();

  //tetrahedron(numTimesToSubdivide);





  modelViewMatrixLoc = gl.getUniformLocation( program, "uMVMatrix" );
  projectionMatrixLoc = gl.getUniformLocation( program, "uPMatrix" );
  uLookAtMatrixLoc = gl.getUniformLocation(program, "uLookAtMatrix");
  normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" ); 

  phi += dr * 10;
  theta += dr * 7;
  document.getElementById("Button0").onclick = function(){radius *= 2.0;};
  document.getElementById("Button1").onclick = function(){radius *= 0.5;};
  document.getElementById("Button2").onclick = function(){theta += dr;};
  document.getElementById("Button3").onclick = function(){theta -= dr;};
  document.getElementById("Button4").onclick = function(){phi += dr;};
  document.getElementById("Button5").onclick = function(){phi -= dr;};

  document.getElementById("Button6").onclick = function(){
    numTimesToSubdivide++; 
    index = 0;
    pointsArray = []; 
    normalsArray = [];
    init();
  };
  document.getElementById("Button7").onclick = function(){
    if(numTimesToSubdivide) numTimesToSubdivide--;
    index = 0;
    pointsArray = []; 
    normalsArray = [];
    init();
  };


  gl.uniform4fv( gl.getUniformLocation(program, 
    "ambientProduct"),flatten(ambientProduct) );
  gl.uniform4fv( gl.getUniformLocation(program, 
    "diffuseProduct"),flatten(diffuseProduct) );
  gl.uniform4fv( gl.getUniformLocation(program, 
    "specularProduct"),flatten(specularProduct) );	
  gl.uniform4fv( gl.getUniformLocation(program, 
    "lightPosition"),flatten(lightPosition) );
  gl.uniform1f( gl.getUniformLocation(program, 
    "shininess"),materialShininess );

  render();
}


function drawScene(lookAt){
  sun.draw(lookAt); 
  earth.draw(lookAt);
  satel.draw(lookAt, earth);
  myungWang.draw(lookAt); 
  //pyr.draw(lookAt);
}
function render() {

  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
  gl.enable(gl.DEPTH_TEST);
  if(isRun){
    sun.jaJeonRad += 1;
    earth.jaJeonRad += 4; // earth.userRad * 4;

    myungWang.userRad += 2/8;
    myungWang.x = 11 * Math.cos(-myungWang.userRad * 3.14 / 180);
    myungWang.z = 6 * Math.sin(-myungWang.userRad * 3.14 / 180);
    myungWang.jaJeonRad = myungWang.userRad * 8;
    satel.jaJeonRad += 2;
  }

  {
    myungWang.days = 1 + Math.trunc(myungWang.userRad * 8 / 360);
    var dis = document.getElementById( "display2");
    dis.innerHTML = "PYears = " + (1 + Math.trunc(myungWang.days / 8)) + "Pday = " + myungWang.days; 
  }
  {
    earth.days = 1 + Math.trunc(earth.jaJeonRad / 360);
    var dis = document.getElementById( "display");
    dis.innerHTML = "EYears = " + (1 + Math.trunc(earth.days / 4)) + "Eday = " + earth.days; 
  }

  // 2분면
  projectionMatrix = perspective(50, gl.viewportWidth / gl.viewportHeight, 0.5, 100.0); 
  projectionMatrix = mult(projectionMatrix, scale3(0.3, 0.3, 0.3));
  gl.viewport(0, gl.viewportHeight / 2, gl.viewportWidth / 2, gl.viewportHeight / 2); 
  eye = vec3(0, 30, eyeDistance);
  drawScene(lookAt(eye, at, up)); 


  // 1분면
  projectionMatrix = perspective(30, gl.viewportWidth / gl.viewportHeight, 0.5, 100.0); 
  projectionMatrix = mult(projectionMatrix, scale3(0.3, 0.3, 0.3));
  gl.viewport(gl.viewportWidth / 2, gl.viewportHeight / 2, gl.viewportWidth / 2, gl.viewportHeight / 2); 
  drawScene(lookAt(vec3(0, 0, 0), vec3(0, 0, -1), vec3(0, 1, 0)));

  // 3분면 : 명왕성에서 지구 보기
  gl.viewport(0, 0, gl.viewportWidth / 2, gl.viewportHeight / 2); 
  drawScene(lookAt(vec3(myungWang.x, myungWang.y, myungWang.z), 
    vec3(earth.x, earth.y, earth.z), vec3(0, 1, 0)));

  // 4분면 : 지구에서 수직면으로 보기, h 로 인공위성에서 지구 보는것 토글.
  gl.viewport(gl.viewportWidth / 2, 0, gl.viewportWidth / 2, gl.viewportHeight / 2); 
  if(viewToggle){
    projectionMatrix = perspective(60, gl.viewportWidth / gl.viewportHeight, 0.5, 100.0); 
    projectionMatrix = mult(projectionMatrix, scale3(0.3, 0.3, 0.3));
    var v = mult(rotate(earth.jaJeonRad, [Math.cos(75 * 3.14 / 180), Math.sin(75 * 3.14 / 180), 0]), vec4(earth.x, earth.y, earth.z, 1));
    //drawScene(lookAt(vec3(earth.x, earth.y, earth.z), vec3(subtract(vec4(earth.x, earth.y, earth.z, 1), v)), vec3(0, 1, 0))); 
    drawScene(lookAt(vec3(satel.x, satel.y, satel.z), vec3(earth.x, earth.y, earth.z), vec3(0, 1, 0)));
  }
  else{
    var v = mult(rotate(earth.jaJeonRad, [Math.cos(75 * 3.14 / 180), Math.sin(75 * 3.14 / 180), 0]), vec4(earth.x, earth.y, earth.z, 1));
    drawScene(lookAt(vec3(earth.x, earth.y, earth.z), vec3(subtract(vec4(earth.x, earth.y, earth.z, 1), v)), vec3(0, 1, 0))); 
  }

  window.requestAnimFrame(render);
}

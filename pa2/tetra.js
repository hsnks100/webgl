
function Tetra(){
  this.index = 0;
  this.pointsArray = [];
  this.normalsArray = [];
  this.x = 0;
  this.y = 0;
  this.z = 0;
  this.scale = 1.0;
  this.jaJeonRad = 0;
  this.userRad = 0;

  this.triangle = function(a, b, c) {
    var t1 = subtract(b, a);
    var t2 = subtract(c, a);
    var normal = normalize(cross(t2, t1));
    normal = vec4(normal);
    normal[3]  = 0.0;

    this.normalsArray.push(normal);
    this.normalsArray.push(normal);
    this.normalsArray.push(normal);


    this.pointsArray.push(a);
    this.pointsArray.push(b);      
    this.pointsArray.push(c);

    this.index += 3;
  };


  this.divideTriangle = function(a, b, c, count) {
    if ( count > 0 ) {

      var ab = mix( a, b, 0.5);
      var ac = mix( a, c, 0.5);
      var bc = mix( b, c, 0.5);

      ab = normalize(ab, true);
      ac = normalize(ac, true);
      bc = normalize(bc, true);

      this.divideTriangle( a, ab, ac, count - 1 );
      this.divideTriangle( ab, b, bc, count - 1 );
      this.divideTriangle( bc, c, ac, count - 1 );
      this.divideTriangle( ab, bc, ac, count - 1 );
    }
    else { 
      this.triangle( a, b, c );
    }
  };


  this.tetrahedron = function(n) {
    var va = vec4(0.0, 0.0, -1.0,1);
    var vb = vec4(0.0, 0.942809, 0.333333, 1);
    var vc = vec4(-0.816497, -0.471405, 0.333333, 1);
    var vd = vec4(0.816497, -0.471405, 0.333333,1);
    this.divideTriangle(va, vb, vc, n);
    this.divideTriangle(vd, vc, vb, n);
    this.divideTriangle(va, vd, vb, n);
    this.divideTriangle(va, vc, vd, n);
  }; 

  this.update = function(){
  };
};

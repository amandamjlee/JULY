var Colors = {
  red:0xf25346,
  white:0xd8d0d1,
  brown:0x59332e,
  pink:0xF5986E,
  brownDark:0x23190f,
  blue:0x122654,
};

window.addEventListener('load', init, false);

function init() {
  // set up the scene, the camera and the renderer
  createScene();

  // add the lights
  createLights();

  // add the objects

  createSea();

  createMoon();
  // createSky();

  // start a loop that will update the objects' positions
  // and render the scene on each frame
  loop();
}

var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH, renderer, container;

function createScene() {
  // Get the width and the height of the screen,
  // use them to set up the aspect ratio of the camera
  // and the size of the renderer.
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;

  // Create the scene
  scene = new THREE.Scene();

  // Add a fog effect to the scene; same color as the
  // background color used in the style sheet

  scene.fog = new THREE.Fog(0x370059, 100, 850);

  // Create the camera
  aspectRatio = WIDTH / HEIGHT;
  fieldOfView = 60;
  nearPlane = 1;
  farPlane = 10000;
  camera = new THREE.PerspectiveCamera(fieldOfView,	aspectRatio, nearPlane, farPlane);

  // Set the position of the camera
  camera.position.x = 0;
  camera.position.z = 200;
  camera.position.y = 100;

  // Create the renderer
  renderer = new THREE.WebGLRenderer({
    // Allow transparency to show the gradient background
    // we defined in the CSS
    alpha: true,

    // Activate the anti-aliasing; this is less performant,
    // but, as our project is low-poly based, it should be fine :)
    antialias: true
  });

  // Define the size of the renderer; in this case,
  // it will fill the entire screen
  renderer.setSize(WIDTH, HEIGHT);

  // Enable shadow rendering
  renderer.shadowMap.enabled = true;

  // Add the DOM element of the renderer to the
  // container we created in the HTML
  container = document.getElementById('world');
  container.appendChild(renderer.domElement);

  // Listen to the screen: if the user resizes it
  // we have to update the camera and the renderer size
  window.addEventListener('resize', handleWindowResize, false);

  var controls = new THREE.VRControls(this.camera);
    controls.standing = true;
    this.camera.position.y = 100;
    // this.camera.position.y = controls.userHeight;

    var mouseControls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    mouseControls.addEventListener('change', this.renderer.render(scene, this.camera));
    mouseControls.enablePan = false;
    mouseControls.enableDamping = true;
    mouseControls.dampingFactor = 0.25;
    mouseControls.enableZoom = false;

}


function handleWindowResize() {
// update height and width of the renderer and the camera
  HEIGHT = window.innerHeight;
  WIDTH = window.innerWidth;
  renderer.setSize(WIDTH, HEIGHT);
  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;

function createLights() {
  // A hemisphere light is a gradient colored light;
  // the first parameter is the sky color, the second parameter is the ground color,
  // the third parameter is the intensity of the light
  hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)

  // A directional light shines from a specific direction.
  // It acts like the sun, that means that all the rays produced are parallel.
  shadowLight = new THREE.DirectionalLight(0xffffff, .9);

  // Set the direction of the light
  shadowLight.position.set(150, 350, 350);

  // Allow shadow casting
  shadowLight.castShadow = true;

  // define the visible area of the projected shadow
  shadowLight.shadow.camera.left = -400;
  shadowLight.shadow.camera.right = 400;
  shadowLight.shadow.camera.top = 400;
  shadowLight.shadow.camera.bottom = -400;
  shadowLight.shadow.camera.near = 1;
  shadowLight.shadow.camera.far = 1000;

  // define the resolution of the shadow; the higher the better,
  // but also the more expensive and less performant
  shadowLight.shadow.mapSize.width = 2048;
  shadowLight.shadow.mapSize.height = 2048;

  // to activate the lights, just add them to the scene
  scene.add(hemisphereLight);
  scene.add(shadowLight);
}


// Instantiate the sea and add it to the scene:

var sea;

function createSea(){
  sea = new Sea();

  // push it a little bit at the bottom of the scene
  sea.mesh.position.y = -330;

  // add the mesh of the sea to the scene
  scene.add(sea.mesh);
}


//////*******MOON
// function createMoon(){
//   var geom = new THREE.SphereGeometry(5,32,32);
// 	var mat = new THREE.MeshPhongMaterial({
// 		color:0xfff954,
// 		transparent:true,
// 		opacity:.6,
// 		shading:THREE.FlatShading,
// 	});
//
// 	var moon = new THREE.Mesh(geom, mat);
//   moon.position.x = 0;
//   moon.position.y = 145;
//   moon.position.z = 100;
// 	// Allow the sea to receive shadows
//   var pointLight = new THREE.PointLight( 0xffffff, 2, 400 );
// 	moon.add( pointLight );
// 	moon.receiveShadow = false;
//   scene.add(moon);
// }

function createMoon(){
  var geom = new THREE.SphereGeometry(70,32,32);
    var mat = new THREE.MeshBasicMaterial({ color: 0xfff954});

    var moon = new THREE.Mesh(geom, mat);
    moon.position.x = 0;
    moon.position.y = 220;
    moon.position.z = -180;
    // Allow the sea to receive shadows
    var pointLight = new THREE.PointLight( 0xfff954, 2, 600 );
    moon.add( pointLight );
    moon.receiveShadow = false;
    scene.add(moon);

  // var dirLight = new THREE.DirectionalLight( 0xffffff, 0.05 );
  // dirLight.position.x = 0;
  // dirLight.position.y = 100;
  // dirLight.position.z = 100;
  // // dirLight.position.set( 0, -1, 0 ).normalize();
  // scene.add( dirLight );
  // dirLight.color.setHSL( 0.1, 0.7, 0.5 );

  // addLight( 0.55, 0.9, 0.5, 5000, 0, -1000 );
  addLight( 0.08, 0.8, 0.5, 0, 400, -600 );
  // addLight( 0.995, 0.5, 0.9, 5000, 5000, -1000 );
}

function addLight( h, s, l, x, y, z ) {
  var moon = new THREE.PointLight( 0xffffff, 1.5, 3000 );
  moon.color.setHSL( h, s, l );
  moon.position.set( x, y, z );
  scene.add( moon );

}
//////*******MOON ENDS


function loop(){
  // Rotate the propeller, the sea and the sky
  // airplane.propeller.rotation.x += 0.3;
  // sea.mesh.rotation.z += .001;
  // sky.mesh.rotation.z += .01;

  // render the scene
  renderer.render(scene, camera);

  // call the loop function again
  requestAnimationFrame(loop);
  sea.moveWaves();
}


Sea = function(){ //=function Sea(){}
  var geom = new THREE.BoxGeometry(1000,600,800,20,10,10);
  // geom.position.y = -100;
  geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

  // important: by merging vertices we ensure the continuity of the waves
  geom.mergeVertices();

  // get the vertices
  var l = geom.vertices.length;

  // create an array to store new data associated to each vertex
  this.waves = [];

  for (var i=0; i<l; i++){
    // get each vertex
    var v = geom.vertices[i];

    // store some data associated to it
    this.waves.push({y:v.y,
                     x:v.x,
                     z:v.z,
                     // a random angle
                     ang:Math.random()*Math.PI*2,
                     // a random distance
                     amp:5 + Math.random()*15,
                     // a random speed between 0.016 and 0.048 radians / frame
                     speed:0.016 + Math.random()*0.032
                    });
  };
  var mat = new THREE.MeshPhongMaterial({
    color:Colors.blue,
    transparent:true,
    opacity:.9,
    shading:THREE.FlatShading,
  });

  this.mesh = new THREE.Mesh(geom, mat);
  this.mesh.receiveShadow = true;


}

// now we create the function that will be called in each frame
// to update the position of the vertices to simulate the waves

Sea.prototype.moveWaves = function (){

  // get the vertices
  var verts = this.mesh.geometry.vertices;
  var l = verts.length;

  for (var i=0; i<l; i++){
    var v = verts[i];

    // get the data associated to it
    var vprops = this.waves[i];

    // update the position of the vertex
    v.x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
    v.y = vprops.y + Math.sin(vprops.ang)*vprops.amp;

    // increment the angle for the next frame
    vprops.ang += vprops.speed;

  }

  // Tell the renderer that the geometry of the sea has changed.
  // In fact, in order to maintain the best level of performance,
  // three.js caches the geometries and ignores any changes
  // unless we add this line
  this.mesh.geometry.verticesNeedUpdate=true;

  // sea.mesh.rotation.z += .001;
}

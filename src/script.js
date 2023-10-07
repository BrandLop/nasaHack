import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';

var renderCalls = [];
function render () {
  requestAnimationFrame( render );
  renderCalls.forEach((callback)=>{ callback(); });
}
render();

/*////////////////////////////////////////*/

var scene, renderer, orbit, light;

/*////////////////////////////////////////*/


var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 10, 3000 );

camera.position.z = 800;

/*////////////////////////////////////////*/

scene = new THREE.Scene();
//scene.fog =  new THREE.FogExp2( 0x000000, 0.0005);//new THREE.Fog(0xEEEEEE, 20, 600);

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x060712 );
renderer.toneMapping = THREE.LinearToneMapping;
renderer.toneMappingExposure = Math.pow( 0.91, 5.0 );

window.addEventListener( 'resize', function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}, false );

document.body.appendChild( renderer.domElement);

renderCalls.push(function(){ renderer.render( scene, camera ); });

let textures = {
  map1: await new THREE.TextureLoader().loadAsync("assets/mapa.jpg"),
  map2: await new THREE.TextureLoader().loadAsync("assets/mapa2.jpg"),
  moon: await new THREE.TextureLoader().loadAsync("assets/moonmap1k.jpg"),
};

/*////////////////////////////////////////*/

const controls = new OrbitControls(camera,renderer.domElement);
controls.target.set(0,0,0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = true;


/*////////////////////////////////////////*/


function makeSun(){

  var geometry = new THREE.SphereGeometry( 100, 32, 32 );

  var customMaterial = new THREE.ShaderMaterial({
    uniforms: { t: { value: 0.1 } },
    vertexShader:   document.getElementById( 'vertexShader'   ).textContent,
    fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,

  });
  
  renderCalls.push(function(){
    customMaterial.uniforms.t.value += 0.02;
  });

  let sun = new THREE.Mesh( geometry, customMaterial );
  sun.castShadow = true;

  return sun;
}

var sun = makeSun();
scene.add( sun );




/*////////////////////////////////////////*/

function makeearht(){
  
  //size = size || 30,
  //distance = distance || 400;
  //speed = speed || 0.001;
  //color = color || 0x6DECB9;

  let pivot = new THREE.Group();
  var geometry = new THREE.SphereGeometry( 30, 16, 16 );
  var material = new THREE.MeshBasicMaterial({
    side: THREE.FrontSide,
    map:textures.map2,
  });

  let planet = new THREE.Mesh( geometry, material );
  pivot.add(planet);
  planet.position.z = 400;

  return pivot;
}

var earht = makeearht();
scene.add(earht);

TweenMax.from(earht.rotation,  50, {
  y: -12,
  z: -9,
  ease:Linear.easeNone, 
  repeat:-1
});

/*////////////////////////////////////////*/

function makemoon(){
  
  var geometry = new THREE.SphereGeometry( 10, 16, 16 );
  var material = new THREE.MeshBasicMaterial({
    map:textures.moon,
  });

  let pivot = new THREE.Group();
  let planet = new THREE.Mesh( geometry, material );
  planet.position.z = 450;
  pivot.add(planet);
  
  return pivot;
}

var moon = makemoon();
//planet.rotation.x = Math.PI/7;
scene.add(moon);


TweenMax.from(moon.rotation, 50, {
  y: -12,
  z: -9,
  ease:Linear.easeNone, 
  repeat:-1
});
// var tl = new TimelineMax({ repeat: -1, yoyo: true })

// tl.from(moon.rotation, 4, {
//   y: -0.2,
//   ease: Expo.easeInOut
// });

// tl.to(moon.rotation, 4, {
//   y: 0.2,
//   ease: Expo.easeInOut
// });


/*////////////////////////////////////////*/

function makeStars() {

  let starMaterial = new THREE.PointsMaterial({
    size: 3,
    blending: THREE.AdditiveBlending
  });

  let geometry = new THREE.SphereGeometry(1400, 80, 80, 0, Math.PI * 2);
  for (let i = 0, len = geometry.vertices.length; i < len; i++){
    let vertex = geometry.vertices[i];
    vertex.x += Math.random() * -200;
    vertex.y += Math.random() * -200;
    vertex.z += Math.random() * -100;
  }

  geometry.verticesNeedUpdate = true;
  geometry.normalsNeedUpdate = true;
  geometry.computeFaceNormals(); 

  return new THREE.Points(geometry, starMaterial);
}

let stars = makeStars()
scene.add(stars);

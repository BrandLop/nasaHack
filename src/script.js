import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.117.1/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls';
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader';
import { mergeBufferGeometries } from 'https://cdn.skypack.dev/three-stdlib@2.8.5/utils/BufferGeometryUtils';

var renderCalls = [];
function render () {
  requestAnimationFrame( render );
  renderCalls.forEach((callback)=>{ callback(); });
}
render();

/*////////////////////////////////////////*/

var scene,scene2, renderer,renderer2, orbit;

/*////////////////////////////////////////*/
var container2 = document.getElementById( "canvas" );
const camera2 = new THREE.PerspectiveCamera (55, 1300 / 200, 0.1, 100 );
camera2.position.set( 0 ,0, 20 );
scene2 = new THREE.Scene();

renderer2 = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
renderer2.setSize( 1300, 200 );
renderer2.setClearColor( 0x000000, 0 )
container2.appendChild( renderer2.domElement);

const pointLight = new THREE.DirectionalLight( 0xffffff, 2.3 );
pointLight.position.set( 10, 10, 10 );
const aoAmbiental = new THREE.AmbientLight(0xffffff, 0.5)
scene2.add( pointLight );
 
const loader = new GLTFLoader();
let mixer;
let realizar;
loader.load( 'assets/Robot.glb', function ( gltf ) {
  const model = gltf.scene;
	scene2.add( model );
  model.position.set(-2,-2,3)
  model.scale.set(2,2,2)  
  //model.rotateY(Math.PI/2  )
  console.log(gltf)
  const clips = gltf.animations;
  mixer = new THREE.AnimationMixer(model);

  const idleClip = THREE.AnimationClip.findByName(clips,'RobotArmature|Robot_Wave')
  const idleAction = mixer.clipAction(idleClip);
  idleAction.clampWhenFinished = true;
  //idleAction.loop= THREE.LoopOnce
  idleAction.play();
  realizar = true;
}, undefined, function ( error ) {
	console.error( error );
} );

loader.load( 'assets/WikiplanetSpaceStation(WSS).glb', function ( gltf ) {
  const model = gltf.scene;
  model.scale.set(3,3,3);
  model.position.set(10,0,0)
  scene2.add( model );
});

const geometry1 = new THREE.PlaneGeometry( 200, 2 );
const material1 = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry1, material1 );
scene2.add( plane );

animate();
const clock = new THREE.Clock();
function animate() {
  if(mixer && realizar == true){
    mixer.update(clock.getDelta());

  }
	requestAnimationFrame( animate );	
	renderer2.render( scene2, camera2 );
	
}

const camera = new THREE.PerspectiveCamera(60, 1300 / 800, 0.1, 4000);

camera.position.z = 900;

/*////////////////////////////////////////*/

scene = new THREE.Scene();
//scene.fog =  new THREE.FogExp2( 0x000000, 0.0005);//new THREE.Fog(0xEEEEEE, 20, 600);
var container = document.getElementById( "canvas2" );

renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( 1300, 800 );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
container.appendChild( renderer.domElement);

const ambient = new THREE.AmbientLight(new THREE.Color("#222222"));
scene.add(ambient);

const light = new THREE.PointLight(new THREE.Color("#ffffff"))
scene.add(light)

light.shadow.mapSize.width = 800;
light.shadow.mapSize.height = 800;
light.shadow.camera.near = 150;
light.shadow.camera.fear = 300;


renderCalls.push(function(){ 
  renderer.render( scene, camera );
});


let textures = {
  map1: await new THREE.TextureLoader().loadAsync("assets/mapa.jpg"),
  map2: await new THREE.TextureLoader().loadAsync("assets/mapa2.jpg"),
  map2_1: await new THREE.TextureLoader().loadAsync("assets/earthspec1k.jpg"),
  map2_2: await new THREE.TextureLoader().loadAsync("assets/earthbump1k.jpg"),
  clouds: await new THREE.TextureLoader().loadAsync("assets/earthcloudmaptrans.jpg"),
  moon: await new THREE.TextureLoader().loadAsync("assets/moonmap1k.jpg"),
  moon2: await new THREE.TextureLoader().loadAsync("assets/moonbump1k.jpg"),
};

/*////////////////////////////////////////*/

const controls = new OrbitControls(camera,renderer.domElement);
controls.target.set(0,0,0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

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

const geometry4 = new THREE.CylinderGeometry( 20, 40,450, 32 ); 
const material4 = new THREE.MeshBasicMaterial( {color: 0xffff00,transparent:true,opacity:0.5} ); 
const cylinder = new THREE.Mesh( geometry4, material4 ); 
cylinder.position.set(0,10,320)
cylinder.rotateX(1.6);
//scene.add( cylinder );

/*////////////////////////////////////////*/

const earhtSystem = new THREE.Group();

var geometry = new THREE.SphereGeometry( 30, 16, 16 );
var material = new THREE.MeshPhongMaterial({
  map:textures.map2,
  bumpMap:textures.map2_2,
  bumpScale:0.5,
  specularMap:textures.map2_1,
  shininess: 0.5
});
let earht = new THREE.Mesh( geometry, material );

earht.rotation.z = 0.41;
earht.castShadow = true;
earht.receiveShadow = true;
earhtSystem.add(earht);

geometry = new THREE.SphereGeometry( 32, 16, 16 );
material = new THREE.MeshPhongMaterial({
  map:textures.clouds,
  transparent:true,
  opacity: 0.5
});


let cloud = new THREE.Mesh( geometry, material );
cloud.rotation.z = 0.41;
cloud.receiveShadow = true;

earhtSystem.add(cloud);


const axiesPoint = [
  new THREE.Vector3(0, 35, 0),
  new THREE.Vector3(0,-35,0)
];

const axisGeom = new THREE.BufferGeometry().setFromPoints(axiesPoint);
const axis = new THREE.Line(axisGeom,new THREE.LineBasicMaterial({
  color: 0x330000,
  transparent: true,
  opacity:0.5
}))

axis.rotation.z = 0.41;
earhtSystem.add(axis);

var geometry2 = new THREE.SphereGeometry( 10, 16, 16 );
var material2 = new THREE.MeshStandardMaterial({
  map:textures.moon,
  bumpMap: textures.moon2,
  bumpScale: 0.5
});

let moon = new THREE.Mesh( geometry2, material2 );
moon.position.z = 50;
moon.castShadow = true;
moon.receiveShadow = true;
earhtSystem.add(moon); 

scene.add(earhtSystem);


const curve = new THREE.EllipseCurve(
  0,0,
  550, 600,
  0, 2*Math.PI,
);

const points = curve.getSpacedPoints(200);

const geometry3 = new THREE.BufferGeometry().setFromPoints(points);
const material3 = new THREE.LineBasicMaterial({ color: 0x333333, transparent:true, opacity:0.5})

const orbit2 = new THREE.Line(geometry3,material3);
orbit2.rotateX(-Math.PI/2);
scene.add(orbit2);

const loopTime = 1;
const earhtOrtbitSpeed = 0.00001;
const moonOrbitRRadius = 55;
const moonOrbitSpeed = 80;

animate2();

function animate2(){
  const time = earhtOrtbitSpeed * performance.now();
  const t = (time%loopTime)/ loopTime;

  let p = curve.getPoint(t);

  earhtSystem.position.x = p.x;
  earhtSystem.position.z = p.y;
  
  



  moon.position.x = -Math.cos(time*moonOrbitSpeed) * moonOrbitRRadius;
  moon.position.z = -Math.sin(time*moonOrbitSpeed) * moonOrbitRRadius;
  moon.position.y = -Math.cos(time*moonOrbitSpeed) * moonOrbitRRadius;

  sun.rotation.y += 0.0008;
  earht.rotation.y += 0.0015;
  cloud.rotation.y += 0.0025;
  moon.rotation.y +=0.0001;



  renderer.render(scene,camera);
  requestAnimationFrame(animate2);
}

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

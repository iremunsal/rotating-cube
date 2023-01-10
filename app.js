import * as THREE from 'three';
import { MathUtils } from 'three';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

var scene, camera, renderer, orbitControls;
var WIDTH  = window.innerWidth;
var HEIGHT = window.innerHeight;
var cube2 = null;
var cube1 = null;
var group = new THREE.Group();
var rotateUp = true;
var targetAngle = 0;
var angle = 0;
var pi = Math.PI;
var zRot = 0;

function init() {
    scene = new THREE.Scene();
    initLight();
    initCamera();
    initModel();
    initModel2();
    initRenderer();
    initControls();
    document.body.appendChild(renderer.domElement);
}


function initLight(){
    var light = new THREE.PointLight( 0xffffcc, 20, 200 );
    light.position.set( 4, 30, -20 );
    scene.add( light );

    var light2 = new THREE.AmbientLight( 0x20202A, 20, 100 );
    light2.position.set( 30, -10, 30 );
    scene.add( light2 );
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(40, WIDTH / HEIGHT, 1, 1000);
}

function initControls() {
    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.object.position.set(-1, 0, 10);
    orbitControls.target = new THREE.Vector3(-1, 0, 0);
    orbitControls.maxPolarAngle = Math.PI / 2;
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.1;
    return orbitControls;
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize( window.innerWidth,  window.innerHeight);
}


function initModel() {
    var material = new THREE.MeshLambertMaterial( { color: 0x00ff00 } );
    const loader = new GLTFLoader()

    loader.load('cubed.glb', function(glb) {
        cube1 = glb.scene
        cube1.position.set(-2, -2, 0);
       
        cube1.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material = material;
            }
        
        })

        group = new THREE.Group();
        group.add(cube1)
        scene.add(group)
    })
   
}

function initModel2() {
    var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
    const loader = new GLTFLoader()

    loader.load('cubed.glb', function(glb) {
        cube2 = glb.scene
        cube2.position.set(-2, 0, 0);
        cube2.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.material = material;
            }
        })
        scene.add(cube2)
    })
   
}


const button = document.getElementById('button');
button.addEventListener('click', changeAngle);
function changeAngle() {
    const inputField = document.getElementById('angleInput');
    angle = Math.sign(targetAngle - zRot) / 50 ;
    targetAngle += inputField.value * (pi/180);
}

function rotateCube() {
    if ( !rotateUp && zRot + angle > 0){
        rotateUp = true
    }
    else if (rotateUp && zRot + angle < 0 ){
        rotateUp = false
    }
    
    if ( rotateUp ){
        cube1.position.set(1,-1,0);
        group.position.set(-1, 1, 0);
        zRot += angle;
        zRot = MathUtils.clamp(zRot, 0, Math.min(targetAngle, 180 * (pi/180)));
    }
    else {
        cube1.position.set(1,1,0);
        group.position.set(-1, -1, 0);
        zRot += angle;
        zRot = MathUtils.clamp(zRot, Math.max(targetAngle, -180 * (pi/180)), 0);
    }
    
    group.rotation.z = zRot
   

}

function render() {
    requestAnimationFrame(render);
    if(cube1){
        rotateCube();
    }
    renderer.render(scene, camera);
}

init();
render();
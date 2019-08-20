let scene = new THREE.Scene();
scene.background = new THREE.Color( 0xf2f2f2 );

//RENDERER - choose, define, mount to DOM
let renderer = new THREE.WebGLRenderer({
    antialias: true //so object edges don't look jagged
})
renderer.setSize( window.innerWidth, window.innerHeight );
//scene is mounted
document.body.appendChild( renderer.domElement );


//GEOMETRY - objects, material, mesh
//CUBE
const geometry = new THREE.BoxGeometry( 180, 180, 180 );
const texture = new THREE.TextureLoader().load('paint.jpg');
const material = new THREE.MeshBasicMaterial( { map: texture } );
const cubeMesh = new THREE.Mesh( geometry, material );
scene.add( cubeMesh );


//SHPERE
const geometryHexagon = new THREE.IcosahedronGeometry( 90, 0 );
const materialHexagon = new THREE.MeshLambertMaterial( { color: 0x00ffcc } );
const hexagonMesh = new THREE.Mesh( geometryHexagon, materialHexagon );
scene.add( hexagonMesh );
//position mesh in spcae
hexagonMesh.position.x = 350;


//TORUS
const geometryTorus = new THREE.TorusGeometry( 80, 30, 16, 100 );
const materialTorus = new THREE.MeshLambertMaterial( { color: 0xff0066 } );
const torusMesh = new THREE.Mesh( geometryTorus, materialTorus );
scene.add( torusMesh );
//position torus in space and on its axis
torusMesh.position.x = -350;
torusMesh.rotation.set(10, 5, 15);


//LIGHTS
let keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);

let fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

let backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

scene.add(keyLight);
scene.add(fillLight);
scene.add(backLight);


//CAMERA - feild of view, aspect ratio, near plane, far plane
camera = new THREE.PerspectiveCamera( 20, window.innerWidth / window.innerHeight, 1, 10000 );
//move camera away from object, default position (0, 0, 0)
camera.position.z = 1800;


//CAMERA RESPOND TO MOUSE
let mouseX = 0
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

function render() {
    camera.position.x += ( - mouseX - camera.position.x ) * 0.09;
    camera.position.y += ( mouseY - camera.position.y ) * 0.09;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}


//HOVER OBJECTS - use Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentIntersectObject;

function onMouseMove(event) {
    event.preventDefault();
    
    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );

    //track mouse
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    //cube rotation follows mouse
    cubeMesh.lookAt(mouse.x, mouse.y, 3);

    raycaster.setFromCamera(mouse, camera);
    
    //on mouse enter mouse leave, change mesh color
    let intersects = raycaster.intersectObjects( scene.children );
    // if: theres any intersections
    if (intersects.length > 0) {
        // if: (first) intersected object != already stored object
        if (intersects[0].object != currentIntersectObject) {

            //if: reference to previous object stored
            if (currentIntersectObject) {
                resetObjectColor();
            }
            //store that object, get its current color and change its color
            currentIntersectObject = intersects[0].object;
            currentIntersectObject.originalColor = currentIntersectObject.material.color.getHex();
            currentIntersectObject.material.color.setHex( 0xffff66 );
        }
    //if: object is already stored, reset back to original color & clear reference to object 
    } else if (currentIntersectObject) {
        resetObjectColor();
        currentIntersectObject = null;
    }
}
window.addEventListener('mousemove', onMouseMove);

//Reset object to original COLOR
function resetObjectColor() {
    currentIntersectObject.material.color.setHex( currentIntersectObject.originalColor );
}


//WINDOW RESIZE - make it responsive
function onWindowResize() {

    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
window.addEventListener('resize', onWindowResize, false);


//ANIMATION LOOP 
//Re-draw scene at rate of monitor's fps
function animate() {
    requestAnimationFrame(animate);

    render();

    //animate the objects rotation
    torusMesh.rotation.y += -0.01
    hexagonMesh.rotation.y += 0.01
    hexagonMesh.rotation.x += 0.01
}
animate();



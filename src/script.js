import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Timer } from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'



//Textures

const textureLoader = new THREE.TextureLoader()
const doorTexture=textureLoader.load('/door/color.jpg')
const floorAlphaTexture=textureLoader.load('./floor/alpha.jpg')
const groundAlphaTexture=textureLoader.load('./floor/Ground.jpg')
const brickTexture=textureLoader.load('./floor/brick.jpg')

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * House
 */


//Floor 
 
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20,20),
    new THREE.MeshStandardMaterial(
        {
            alphaMap:floorAlphaTexture,
            transparent:true,
            map:groundAlphaTexture
            
        }
    )
)
floor.rotation.x=-Math.PI*0.5
scene.add(floor)


//House container
const house = new THREE.Group()
scene.add(house)

//wals
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(4,2.5,4),
    new THREE.MeshStandardMaterial({
        map:brickTexture
    })
)
walls.position.y+=1.25
house.add(walls)

//roof 
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5,1.5,4),
    new THREE.MeshStandardMaterial()
)
roof.position.y+=2.5+0.75
roof.rotation.y=Math.PI/4
house.add(roof)

//door 

const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2,2.2),
    new THREE.MeshStandardMaterial({map:doorTexture,metalness:0.5, roughness:5})
)
door.position.z=2+0.1
door.position.y=1

house.add(door)

//Bushes
const bushGeometry=new THREE.SphereGeometry(1,16,16)
const bushMaterial=new THREE.MeshStandardMaterial({color:'green'})

const bush1=new THREE.Mesh(bushGeometry,bushMaterial)
bush1.scale.set(0.5,0.5,0.5)
bush1.position.set(0.8,0.2,2.2)

const bush2=new THREE.Mesh(bushGeometry,bushMaterial)
bush2.scale.set(0.25,0.25,0.25)
bush2.position.set(1.4,0.1,2.1)

const bush3=new THREE.Mesh(bushGeometry,bushMaterial)
bush3.scale.set(0.4,0.4,0.4)
bush3.position.set(-0.8,0.1,2.2)


const bush4=new THREE.Mesh(bushGeometry,bushMaterial)
bush4.scale.set(0.15,0.15,0.15)
bush4.position.set(-1,0.05,2.6)
house.add(bush1,bush2,bush3,bush4)


//Graves
const graveGeometry = new THREE.BoxGeometry(0.6,0.8,0.2)
const graveMaterial=new THREE.MeshStandardMaterial()

const graves = new THREE.Group()
scene.add(graves)

for (let i=0;i < 30;i++){
     const angle=Math.random()*Math.PI*2
     const radius=3+Math.random()*4
     const x = Math.sin(angle)*radius
     const z = Math.cos(angle)*radius
    //Mesh
    const grave =new THREE.Mesh(graveGeometry,graveMaterial)
    grave.position.x=x
    grave.position.y=Math.random()*0.4
    grave.position.z=z
    grave.rotation.x=(Math.random()-0.5)*0.4
    grave.rotation.y=(Math.random()-0.5)*0.4
    grave.rotation.z=(Math.random()-0.5)*0.4

    //add to grave group
    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5,200)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(directionalLightHelper)

//point LIght 

const pointLight = new THREE.PointLight('red',0.5,6,6)
pointLight.position.set(0,2.1,1.8)
scene.add(pointLight)

// const pointLightHelper = new THREE.PointLightHelper(pointLight);
// scene.add( pointLightHelper );
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const timer = new Timer()

const tick = () =>
{
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
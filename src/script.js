import { Scene, PerspectiveCamera, WebGLRenderer, Color, Vector3 } from 'three';
import { OrbitControls } from '/node_modules/three/examples/jsm/controls/OrbitControls.js';
import { createSculpture } from '/src/shader-park-core.esm.js';
import { spCode } from '/src/sp-code.js';

let scene = new Scene();

let container = document.getElementById('three-container'); // 获取容器元素

function updateContainerDimensions() {
    let width, height;
    if (window.innerWidth > 1100) {
        width = window.innerWidth * 0.4 + 200;
        height = window.innerHeight * 0.4 + 200;
    } else {
        width = window.innerWidth * 0.9 - 20;
        height = window.innerHeight * 0.4 - 20;
    }
    container.style.width = `${width}px`;
    container.style.height = `${height}px`;
    console.log('Window height:', window.innerWidth);
    console.log('Window height:', window.innerHeight);
    console.log('Container width:', width);
    console.log('Container height:', height);
    return { width, height };
}

let { width, height } = updateContainerDimensions();

console.log('Initial container width:', width);
console.log('Initial container height:', height);

let camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.z = 2;

let renderer = new WebGLRenderer({ antialias: false, alpha: true });
renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio * 0.3);
renderer.setClearColor(new Color(0, 0, 0), 0);
let canvas = renderer.domElement;
container.appendChild(canvas);
console.log('is webgl2', renderer.capabilities.isWebGL2);

let mouse = new Vector3();

canvas.addEventListener('pointermove', (e) => {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const canvasX = (e.pageX - canvas.offsetLeft) * devicePixelRatio;
    const canvasY = (e.pageY - canvas.offsetTop) * devicePixelRatio;
    mouse.set(
        (2.0 * canvasX) / canvas.width - 1.0,
        2.0 * (1.0 - canvasY / canvas.height) - 1.0,
        0
    );
}, false);

let params = { time: 0 };

// Shader Park setup
let mesh = createSculpture(spCode, () => ({
    time: params.time,
    size: 12,
    gyroidSteps: .03,
    scale: 1.0,
}));

scene.add(mesh);

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.zoomSpeed = 0.5;
controls.rotateSpeed = 0.5;
controls.enableZoom = false;
controls.enablePan = false;

let onWindowResize = () => {
    let width = container.clientWidth;
    let height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
};

window.addEventListener('resize', onWindowResize);

let render = () => {
    requestAnimationFrame(render);
    params.time += 0.01;
    controls.update();
    renderer.render(scene, camera);
};

render();
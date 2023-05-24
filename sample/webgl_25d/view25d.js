import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DragControls } from 'three/addons/controls/DragControls.js';

import {
    get_file_list,
    remove_file,
    copy_file,
    move_file,
    create_folder,
    remove_folder,
    uploadBufferess,
    readFile
} from 'ideon/comLibs/webdiskApi.js';
//import Elvis from 'evlis';
///import ObjectMngSetup from 'ideon/elvisPlugins/objMng.js';

export default async function ({
    container,
    window_size,
    cameraPosition = new THREE.Vector3(0, 0, 10),
    cameraTarget = new THREE.Vector3(),
    // cameraFov = 90,
    cameraNear = -256, cameraFar = 256,
    isGrid = true,
    onUpdate
}) {

    console.log(`objectViewer version 1.0.0`);
    console.log(`THREE version ${THREE.REVISION}`);
    // console.log(`elvis version ${Elvis.version}`);

    // const _HDRILoader = envMapFileFormat === 'exr' ? new EXRLoader() : new RGBELoader();

    let bEnableKeyInput = true;
    let keyStates = [];

    // let container, stats;
    let camera, scene, raycaster, renderer;

    let theta = 0;
    let INTERSECTED;

    const pointer = new THREE.Vector2();
    const radius = 500;
    const frustumSize = 1000;
    // const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const aspect = window_size.width / window_size.height;
    camera = new THREE.OrthographicCamera(frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, -256, 256);

    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window_size.width, window_size.height);
    renderer.setAnimationLoop((time) => {

        // console.log(time);

        camera.updateMatrixWorld();
        renderer.render(scene, camera);

    });

    container.appendChild(renderer.domElement);

    //오빗컨트롤
    //카메라의 현재 위치 기준으로 시작한다.
    const orbitControl = new OrbitControls(camera, renderer.domElement);
    orbitControl.target.set(0, 0, 0);
    orbitControl.enableRotate = false; // 회전 비활성화
    orbitControl.update();
    // scope.orbitControl = orbitControl;

    //dummy object setup
    const root_dummy = new THREE.Group();
    scene.add(root_dummy);

    // const res = await readFile(currentDir, this.dataset.name, _Context.token)

    const loader = new THREE.TextureLoader();

    const texture = await new Promise((resolve, reject) => {
        const _url = `../../poster.jpg`;
        loader.load(_url, function (texture) {
            resolve(texture);
        },
            function (xhr) {
                onProgress ? onProgress({
                    name: textureFile,
                    progress: (xhr.loaded / xhr.total * 100)
                }) : null;
            }
            ,
            err => {
                console.log(err);
                return reject(err);
            }
        );
    })

    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 4;
    texture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.PlaneGeometry(texture.image.width, texture.image.height , 1);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
    });


    const planeImage = new THREE.Mesh(geometry, material);
    root_dummy.add(planeImage);

    // function animate() {

    //     requestAnimationFrame(animate);
    //     render();
    // }

    // function render() {
    //     camera.updateMatrixWorld();
    //     renderer.render(scene, camera);
    // }

    return {
        engine: {
            camera: camera,
            scene: scene,
            renderer: renderer
        },
        // startRenderer: () => {
        //     animate();
        // },
        // objMng: objMng,
        
        resetCamera: function () {
            scope.camera.position.set(0, 100, 200);
            scope.camera.lookAt(0, 0, 0);
        },
        getEnableKeyInput: function () {
            return bEnableKeyInput;
        },
        setEnableKeyInput: function (bEnable) {
            bEnableKeyInput = bEnable;
        },
        getKeyStates: function (keyCode) {
            return keyStates[keyCode];
        }
    }

}


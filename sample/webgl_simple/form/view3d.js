import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default async function ({
    container,
    window_size

}) {

    console.log(`THREE version ${THREE.REVISION}`);
    
    //camera setup
    const camera = new THREE.PerspectiveCamera(70, window_size.width / window_size.height, 0.01, 10);
    
    //look at
    camera.position.set(0, 1, 1);
    camera.lookAt(0, 0, 0);
    
    //scene setup
    const scene = new THREE.Scene();

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 ,wireframe:true});

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0.5, 0);
    scene.add(mesh);

    //grid helper
    const gridHelper = new THREE.GridHelper(10, 10,0xffff00,0xff0000);
    scene.add(gridHelper);

    //renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window_size.width, window_size.height);
    renderer.setAnimationLoop(animate);

    //오빗컨트롤
    //카메라의 현재 위치 기준으로 시작한다.
    const orbitControl = new OrbitControls(camera, renderer.domElement);
    orbitControl.target.set(0, 0, 0);
    // orbitControl.enableRotate = false; // 회전 비활성화
    orbitControl.update();

    container.appendChild(renderer.domElement);

    function animate(time) {
        mesh.rotation.x = time / 2000;
        mesh.rotation.y = time / 1000;
        renderer.render(scene, camera);
    }

    return {
        engine: {
            camera: camera,
            scene: scene,
            renderer: renderer
        }
    }

}


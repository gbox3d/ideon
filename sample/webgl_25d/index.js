import * as THREE from 'three';
import WEBGL from 'three/addons/capabilities/WebGL.js';

import view25dSetup from './view25d.js';


async function main() {

    console.log(`THREEJS Version : ${THREE.REVISION} `);
    console.log(`WebGL Support : ${WEBGL.isWebGL2Available()}`);

    const titleBar = document.querySelector('#title-bar')
    titleBar.innerHTML = 'The Ideon 2.5D demo';

    try {
        
        const mainContext = {            
            modalContainer: document.querySelector('.modal-container'),
            body_container: document.querySelector('.body-container'),
        }

        const view25d = await view25dSetup({
            container: mainContext.body_container,
            window_size: {
                width : 800,
                height : 600
            }
        });

        // view25d.startRenderer();

            

    }
    catch (err) {
        console.error(err);
    }
}



export default main;
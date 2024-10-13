// import * as THREE from 'three';
import uiMenuBarSetup from './uiMenuBar.js';
import { comFileFindFile } from "../../../modules/comLibs/utils.js";

export default async function (_Context) {

    const _htmlText = `
    <div class="ui-view">
        <div class='ui-menu-bar'></div>
        <div class='gl-container'></div>
    </div>
    `;

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(_htmlText, 'text/html');
    const _rootElm = htmlDoc.querySelector('.ui-view');

    //menu bar 등록 
    const _menuBar = await uiMenuBarSetup(_Context);
    _rootElm.querySelector('.ui-menu-bar').appendChild(_menuBar.element);

    //메뉴 이밴트 처리 
    _menuBar.setCallback(async (menuName, btnName) => {
        console.log(menuName);

        if (btnName === 'Hello') {
            switch (menuName) {
                case 'msgModal':
                    _Context.messageModal.show({
                        title: 'Message Modal Title',
                        msg: 'Hello Ideon'
                    });
                    break;
                case 'progressModal':
                    // _Context.progressModal.show({

                    break;
                case 'waitModal':
                    break;
            }
        }
        else {
            if (menuName === 'About') {



            }
        }


    });


    _Context.body_container.appendChild(_rootElm);

    console.log('complete setup uiMain');

    return {
        element: _rootElm,
        menubar: _menuBar,
        // objViewer: objViewer
    }

}
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

export default function (_Context) {

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(
        `
        <div class="w3-modal" >
            <div class="w3-modal-content">
                <header class="w3-container w3-teal">
                    <div class="w3-center">
                        <span class="w3-button w3-xlarge w3-hover-red w3-display-topright" title="Close Modal">&times;</span>
                        <h2>select file</h2>
                    </div>
                </header>
                <form class="w3-container">                    
                    <ul class='w3-ul w3-margin'></ul>
                    <input id="filepath-input" class='w3-input' disable />
                    <button class="w3-button w3-block w3-green w3-section w3-padding" type="submit"> 열기 </button>
                </form>
            </div>
        </div>`
        , 'text/html');

    const _rootElm = htmlDoc.querySelector('.w3-modal');
    const _inputFile = _rootElm.querySelector('#filepath-input');
    const _fileList = _rootElm.querySelector('ul');
    const _title = _rootElm.querySelector('header h2');


    _fileList.style.height = '300px';
    _fileList.style.overflowY = 'scroll';

    let currentDir = _Context.root_path;
    let bDirectoryOnly = false;

    _Context.modalContainer.appendChild(_rootElm);

    let onCallback = null;

    _rootElm.querySelector('form').addEventListener('submit', (evt) => {

        evt.preventDefault();

        _rootElm.style.display = 'none';

        onCallback ? onCallback(_inputFile.value) : null

    })

    _rootElm.querySelector('[title="Close Modal"]').addEventListener('click', async (evt) => {
        _rootElm.style.display = 'none';
        onCallback ? onCallback('') : null;
    })

    function _onSelectFile() {
        _inputFile.value = `${currentDir}${this.dataset.name}`;

        //clear other selected
        let list = _fileList.children;
        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove('w3-indigo');
        }
        this.classList.add('w3-indigo');
    }

    function _onSelectFolder() {
        if (this.dataset.name === '..') {
            currentDir = currentDir.split('/').slice(0, -2).join('/')
            currentDir += '/';
            console.log(currentDir);
        }
        else {
            currentDir += `${this.dataset.name}/`;
        }

        _inputFile.value = currentDir;

        updateList();
    }

    async function updateList() {

        let _result = await get_file_list(currentDir, _Context.token);

        console.log(_result)

        let _ul = _fileList;
        _ul.innerHTML = '';

        //up dir
        if (currentDir !== _Context.root_path) {
            let _li = document.createElement('li');
            _li.innerText = '..';
            _li.dataset.type = 2;
            _li.dataset.name = '..';
            _li.addEventListener('click', _onSelectFolder.bind(_li));
            _ul.appendChild(_li);
        }

        _.each(_result.list, (item) => {

            if (bDirectoryOnly ) {
                
                if(item.type !== 2) return;
                
                let _li = document.createElement('li');
                
                _li.innerHTML = `[${item.name}]`;
                _li.addEventListener('click', _onSelectFolder.bind(_li));

                _li.dataset.name = item.name
                _li.dataset.type = parseInt(item.type);
                _ul.appendChild(_li);

            }
            else {

                let _li = document.createElement('li');

                if (item.type === 1 && !bDirectoryOnly) {
                    _li.innerHTML = item.name;
                    _li.addEventListener('click', _onSelectFile.bind(_li));
                } else if (item.type === 2) { //directory
                    _li.innerHTML = `[${item.name}]`;
                    _li.addEventListener('click', _onSelectFolder.bind(_li));
                }

                _li.dataset.name = item.name
                _li.dataset.type = parseInt(item.type);

                _ul.appendChild(_li);

            }

        });

    }

    return {
        element: _rootElm,
        show: async function (_callback, _rootDir) {
            currentDir = _rootDir + '/';
            _inputFile.value = currentDir;
            updateList();
            onCallback = _callback;
            _rootElm.style.display = 'block';
        },
        close: function () {
            _rootElm.style.display = 'none';
        },
        setCallback: function (_callback) {
            onCallback = _callback;
        },
        setOption(
            { title, rootDir, callback, dirOnly }
        ) {

            title ? _title.innerText = title : null;
            rootDir ? currentDir = rootDir : null;
            callback ? onCallback = callback : null;
            dirOnly ? bDirectoryOnly = dirOnly : null;

        }
    }


}
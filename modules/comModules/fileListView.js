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

export default async function ({
    Context,
    onSelectCallback = null,
    width = 300,
    height = 500
}) {

    const _htmlText = `
        <div class="ui-view">
            <div class="w3-panel w3-red" >
                <h3 id="dir-info" ></h3>
                <h3 id="file-count" ></h3>
            </div>
            <ul class='w3-ul w3-horverable' >
            </ul>
            
        </div>
            `;

    const _Context = Context;
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(_htmlText, 'text/html');
    const _rootElm = htmlDoc.querySelector('.ui-view');
    const _fileList = _rootElm.querySelector('ul');
    const _dirInfo = _rootElm.querySelector('h3#dir-info');
    const _fileCount = _rootElm.querySelector('h3#file-count');


    _dirInfo.style.margin = '0px';
    _dirInfo.style.padding = '0px';
    _dirInfo.style.fontSize = '12px';
    // _dirInfo.style.width = '20px';
    _dirInfo.style.overflow = 'auto';

    _fileCount.style.margin = '0px';
    _fileCount.style.padding = '0px';
    _fileCount.style.fontSize = '12px';
    _fileCount.style.boarderBottom = '1px solid #ccc';


    _fileList.style.width = width + 'px';
    _fileList.style.height = height + 'px';
    _fileList.style.overflow = 'auto';

    let currentDir = './';
    let _onSelectCallback = onSelectCallback;

    async function _onSelectFile(evt) {

        const target = evt.target;

        //check if checkbox is clicked 건너뛰기 
        if(target.classList.contains('item-checkbox')) return

        //clear other selected
        let list = _fileList.children;
        for (let i = 0; i < list.length; i++) {
            list[i].classList.remove('w3-indigo');
        }
        this.classList.add('w3-indigo');
        const res = await readFile(currentDir, this.dataset.name, _Context.token)
        // console.log(res);
        res.dir = currentDir;
        res.fileName = this.dataset.name;

        _onSelectCallback?.(res);
    }

    function _SelectNext() {
        const list = _fileList.children;
        for (let i = 0; i < list.length; i++) {
            if (list[i].classList.contains('w3-indigo')) {
                if (i + 1 < list.length) {
                    list[i + 1].click();
                }
                break;
            }
        }
    }

    function _SelectPrev() {
        const list = _fileList.children;
        for (let i = 0; i < list.length; i++) {
            if (list[i].classList.contains('w3-indigo')) {
                if (i - 1 >= 0) {
                    list[i - 1].click();
                }
                break;
            }
        }
    }

    function _onSelectFolder(evt) {
        const target = evt.target;

        if (target.classList.contains('item-checkbox')) {
        }
        else {
            if (this.dataset.name === '..') {
                currentDir = currentDir.split('/').slice(0, -2).join('/')
                currentDir += '/';
                console.log(currentDir);
            }
            else {
                currentDir += `${this.dataset.name}/`;
            }
            _updateList();
        }


    }

    function __updateList(filelist) {
        _fileList.innerHTML = '';

        let _li = document.createElement('li');
        _li.innerText = '..';
        _li.dataset.type = 2;
        _li.dataset.name = '..';
        _li.addEventListener('click', _onSelectFolder.bind(_li));

        _fileList.appendChild(_li);

        for (let i = 0; i < filelist.length; i++) {
            let _li = document.createElement('li');

            // Add checkbox for each item
            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'item-checkbox w3-check w3-right';
            _li.appendChild(checkbox);


            const _file = filelist[i];

            const _bar = document.createElement('div');
            _bar.insertAdjacentHTML('beforeend', `
                            <span class="w3-small name">${_file.name}</span><br>
                            <span class="type" >file</span>
                        `);
            _bar.classList.add('w3-bar-item');
            _bar.querySelector('.name').style.fontWeight = 'bold';
            _bar.querySelector('.name').style.width = '170px';
            _bar.querySelector('.name').style.display = 'inline-block';
            _bar.querySelector('.name').style.overflow = 'hidden';
            _bar.querySelector('.name').style.textOverflow = 'ellipsis';
            _bar.querySelector('.name').style.whiteSpace = 'nowrap';

            if (_file.type === 1) {

                _bar.querySelector('.name').innerText = _file.name;
                _bar.querySelector('.type').innerText = `${_file.size}`;

                _li.appendChild(_bar);
                _li.addEventListener('click', _onSelectFile.bind(_li));

            } else if (filelist[i].type === 2) { //directory

                _bar.querySelector('.name').innerText = `[${_file.name}]`;
                _bar.querySelector('.type').innerText = `_`;
                _li.appendChild(_bar);
                _li.addEventListener('click', _onSelectFolder.bind(_li));
            }
            _li.dataset.name = _file.name
            _li.dataset.type = _file.type;
            _li.dataset.size = _file.size;
            _fileList.appendChild(_li);
        }

        _fileCount.innerText = `Total ${filelist.length} files`;

        return _fileList.length;

    }

    async function _updateList(list) {

        if (list) {
            __updateList(list);
        }
        else {
            try {
                // console.log(currentDir);
                const res = await get_file_list(currentDir, _Context.token);

                if (res.r === 'ok') {
                    const filelist = res.list;
                    // console.log(filelist);

                    __updateList(filelist);

                    _dirInfo.innerText = currentDir;
                }
                else {
                    console.log('error');
                }

            }
            catch (err) {
                console.error(err);
            }
        }
    }

    return {
        rootElm: _rootElm,
        hide: function () {
            _rootElm.style.display = 'none';
        },
        show: function (basePath) {
            _rootElm.style.display = 'block';
            currentDir = basePath;
            _updateList();
        },
        updateList: _updateList,
        setCallback: function (callback) {
            _onSelectCallback = callback;
        },
        getCheckedList: function () {

            let list = _fileList.querySelectorAll('.item-checkbox:checked');
            let selectedList = [];
            for (let i = 0; i < list.length; i++) {
                selectedList.push(list[i].parentElement.dataset.name);
            }
            return selectedList;

        },
        unSelectAll: function () {
            let list = _fileList.querySelectorAll('.item-checkbox:checked');
            for (let i = 0; i < list.length; i++) {
                list[i].checked = false;
            }
        },
        selectAll : function() {
            const list = _fileList.querySelectorAll('li .item-checkbox');
            for (let i = 0; i < list.length; i++) {
                list[i].checked = true;
            }

        },
        getCurrentDir: function () {
            return currentDir;
        },
        setCurrentDir: function (dir) {
            currentDir = dir;
        },
        getFileList() {
            const list = _fileList.querySelectorAll('li');

            return Array.from(list).map((li) => {
                return {
                    name: li.dataset.name,
                    type: parseInt(li.dataset.type),
                    size: parseInt(li.dataset.size)
                }
            });
        },
        selectNext: _SelectNext,
        selectPrev: _SelectPrev

    }
}
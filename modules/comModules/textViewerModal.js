//filename : textViewerModal.js
//author : gbox3d
//기능 : 단순 텍스트를 화면에 출력해주는 모달 내용이 길경우 스크롤 가능
export default function (_Context) {

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(
        `
    <div class="w3-modal">
        <div class="w3-modal-content">
            <header class="w3-container w3-teal">
                <div class="w3-center">
                    <span class="w3-button w3-xlarge w3-hover-red w3-display-topright" title="Close Modal">&times;</span>
                    <h2>Text Viewer</h2>
                </div>
            </header>
            <div class="w3-container w3-padding w3-grey">
                <div class="w3-section text-context" >
                    
                </div>
            </div>
        </div>
  </div>

    </div>`
        , 'text/html');

    const _rootElm = htmlDoc.querySelector('.w3-modal');
    _Context.modalContainer.appendChild(_rootElm);
    const _textContent = _rootElm.querySelector('.w3-container .text-context');

    //style 설정 
    _textContent.style.width = "600px";
    _textContent.style.height = "400px";
    _textContent.style.overflow = "auto";
    _textContent.style.backgroundColor = "black";
    _textContent.style.color = "green";

    
    function closeModal() {

        _textContent.innerText = ''
        _rootElm.style.display = 'none';
    }

    _rootElm.querySelector('[title="Close Modal"]').addEventListener('click', closeModal);

    return {
        element: _rootElm,
        show: function ({ text}) {
            // _Title.innerText = title;
            _textContent.innerText = text;
            _rootElm.style.display = 'block';
        },                
        close({delay}) {
            delay = delay || 0;
            setTimeout(closeModal, delay);
        }
        
    }
}
export default function (_Context) {

    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(
        `
    <div class="w3-modal">
        <div class="w3-modal-content">
            <h2>Login</h2>
            <form>
            <label>Username</label>
            <input class="w3-input" type="text" name="username">
            <label>Password</label>
            <input class="w3-input" type="password" name="password">
            <button class="w3-button w3-blue" type="submit">Log in</button>
            </form>
        </div>        
    </div>`
        , 'text/html');

    const _rootElm = htmlDoc.querySelector('.w3-modal');
    const _loginBtn = _rootElm.querySelector('button[type="submit"]');

    _Context.modalContainer.appendChild(_rootElm);

    const _idEdit = _rootElm.querySelector('input[name="username"]');
    const _pwEdit = _rootElm.querySelector('input[name="password"]'); 
    
    let _onLogin = null;


    _loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        let id = _idEdit.value;
        let pw = _pwEdit.value;

        _loginBtn.disabled = true;
        _loginBtn.innerHTML = '로그인 중...';


        let res = await (await (fetch(`/api/v2/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: id,
                userPw: pw
            })
        }))).json();

        setTimeout(() => {
            _loginBtn.disabled = false;
            _loginBtn.innerHTML = '로그인';
            if(_onLogin) _onLogin(res);
        }, 500);

        _rootElm.style.display = 'none';
    });

    return {
        element: _rootElm,
        show: function (onLogin) {            
            _rootElm.style.display = 'block';    
            _onLogin = onLogin;
        },
        setOnLogin: function (onLogin) {
            _onLogin = onLogin;
        }
    }
}
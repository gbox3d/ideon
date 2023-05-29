let host_url = '';

export function makeFileObj(file) {

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', (evt) => {
      resolve({
        file: file,
        data: evt.target.result
      });
    });
    reader.readAsArrayBuffer(file);
  })
}

export function makeFormBody(data) {
  return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key])).join('&');
}

export function set_host_url(url) {
  host_url = url;
}
export function get_host_url() {
  return host_url;
}

export async function get_file_list(path, jwt_token) {
  return await (
    await fetch(`${host_url}/api/v2/webdisk/ls`, {
      method: 'POST',
      body: path,
      headers: {
        'Content-Type': 'text/plain',
        'authorization': jwt_token,
      },
    })
  ).json();
}

export async function remove_file(path, file, jwt_token) {
  return await (
    await fetch(`${host_url}/api/v2/webdisk/rm`, {
      method: 'POST',
      body: `${path}\n${file}`,
      headers: {
        'Content-Type': 'text/plain',
        'authorization': jwt_token,
      },
    })
  ).json();
}

export async function copy_file(src, dest, jwt_token) {
  return await (
    await fetch(`${host_url}/api/v2/webdisk/cp`, {
      method: 'POST',
      body: `${src}\n${dest}`,
      headers: {
        'Content-Type': 'text/plain',
        'authorization': jwt_token,
      },
    })
  ).json();
}

export async function move_file(src, dest, jwt_token) {
  return await (
    await fetch(`${host_url}/api/v2/webdisk/mv`, {
      method: 'POST',
      body: `${src}\n${dest}`,
      headers: {
        'Content-Type': 'text/plain',
        'authorization': jwt_token,
      },
    })
  ).json();
}

export async function create_folder(path, folder, jwt_token) {
  return await (
    await fetch(`${host_url}/api/v2/webdisk/mkdir`, {
      method: 'POST',
      body: `${path}\n${folder}`,
      headers: {
        'Content-Type': 'text/plain',
        'authorization': jwt_token,
      },
    })
  ).json();
}

export async function remove_folder(path, folder, jwt_token) {
  return await (
    await fetch(`${host_url}/api/v2/webdisk/rmdir`, {
      method: 'POST',
      body: `${path}\n${folder}`,
      headers: {
        'Content-Type': 'text/plain',
        'authorization': jwt_token,
      },
    })
  ).json();
}

export async function uploadBufferess(path, upload_name, fileObj, jwt_token) {

  return await new Promise((resolve, reject) => {

    const reader = new FileReader();

    reader.addEventListener('load', async (_) => {
      const _path = path
      console.log(`now uploading... ${upload_name}`)

      try {

        let _url = `${host_url}/api/v2/uploader/bufferless`;

        let _ = await (await (fetch(_url, {
          method: 'POST',
          body: reader.result,
          // 이 부분은 따로 설정하고싶은 header가 있다면 넣으세요, 헤더이름은 대소 문자를 구분하지않음 무조건 소문자 취급
          headers: new Headers({
            'Content-Type': fileObj.type,
            'upload-name': upload_name,
            'upload-path': _path,
            'authorization': jwt_token
          })
        }))).json();

        // console.log(`upload ${upload_name}...ok`)
        resolve(_)

      } catch (error) {
        console.log(error)
        // this.infoText.innerText = error
        reject({
          r: 'error',
          error: error
        })
      }
    })
    reader.readAsArrayBuffer(fileObj);
  })
}

export async function readFile(path, file, jwt_token) {

  const _bodyData = `${path}\n${file}`

  let resp = await (fetch(`${host_url}/api/v2/webdisk/readFile`, {
    method: 'POST',
    body: _bodyData,
    headers: {
      'Content-Type': 'text/plain',
      'authorization': jwt_token,
    }
  }))

  if (resp.ok) {
    console.log(resp.headers.get('content-type'))
    let contentType = resp.headers.get('content-type')

    if (contentType.includes('image')) {

      let responseAsBlob = await resp.blob() //바이너리 원본데이터얻기 
      let imgUrl = URL.createObjectURL(responseAsBlob); //url 객체로 변환

      return {
        type: 'image',
        url: imgUrl
      }
    }
    else if (contentType.includes('text')) {
      let text = await resp.text()

      return {
        type: 'text',
        data: text
      }
    }
    else if (contentType.includes('json')) {
      let json = await resp.json()

      return {
        type: 'json',
        data: json
      }
    }
    else if (contentType.includes('video')) {
      let responseAsBlob = await resp.blob() //바이너리 원본데이터얻기
      let videoUrl = URL.createObjectURL(responseAsBlob); //url 객체로 변환

      return {
        type: 'video',
        url: videoUrl
      }
    }
    else if (contentType.includes('audio')) {
      let responseAsBlob = await resp.blob() //바이너리 원본데이터얻기
      let audioUrl = URL.createObjectURL(responseAsBlob); //url 객체로 변환

      return {
        type: 'audio',
        url: audioUrl
      }
    }
    else if (contentType.includes('application')) {
      let responseAsBlob = await resp.blob() //바이너리 원본데이터얻기
      let fileUrl = URL.createObjectURL(responseAsBlob); //url 객체로 변환

      return {
        type: 'file',
        url: fileUrl
      }
    }
    else {
      alert('read error')
    }

  }
  else {
    alert('read error')
  }
}

export async function writeFile({ path, fileName, data, jwt_token }) {

  let params = {
    path : path,
    fileName : fileName
  };

  const query = makeFormBody(params);

  return await (await fetch(`${host_url}/api/v2/webdisk/writeFile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
      'authorization': jwt_token,
      query : query
    },
    body: data
  })).json();
}


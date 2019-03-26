import '../scss/index.scss';

window.onload = function() {
    const btn_send = document.getElementById('btn-send');
    btn_send.addEventListener('click', sendFile.bind(this));
    document.getElementById('input-upload').addEventListener('change', handleFileSelect, true);
    document.getElementById('btn-folder').addEventListener('click', createFolder.bind(this));
    document.getElementById('server-result').addEventListener('dragover', (e) => { e.preventDefault()});
    document.getElementById('dropZone').addEventListener('dragenter', dragEnterFile);
    document.getElementById('dropZone').addEventListener('dragleave', dragLeaveFile);
    document.getElementById('dropZone').addEventListener('dragover', dragOverFile);
    document.getElementById('dropZone').addEventListener('drop', dropFile);
    
    renderFolders();
}

function renderFolders() {
    if(document.getElementsByClassName('div-info')) {
        document.getElementById('server-result').innerHTML = '';
    }
    const xhr = new XMLHttpRequest();
    //xhr.open('GET', '/api/folder', true);
    xhr.open('GET', '/api/folder', true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if(this.readyState !== 4) return;
        if(this.status === 200) {
            const res = JSON.parse(this.response);
            for(let i = 0; i < res.length; i++) {
                let div_info = document.createElement('ul');
                div_info.className = 'div-info';
                div_info.addEventListener('drop', dragDrop);
                div_info.addEventListener('dragenter', dragEnter);
                div_info.addEventListener('dragleave', dragLeave);
                // div_info.innerHTML = `<a> ${res[i].name} </a>`;
                div_info.innerText = res[i].name;
                div_info.id = res[i].id;
                div_info.addEventListener('click', openFolder.bind(this));
                // div_link.id = res[i].id;

                document.getElementById('server-result').appendChild(div_info);
            }
        }
        else console.log(' :C ');
    }
};

function openFolder(e) {
    console.log(e.target)
    if(document.getElementsByClassName('div-file').length !== 0) {
        const files = document.getElementsByClassName('div-file');
        while(files.length > 0) 
            files[0].parentNode.removeChild(files[0])
    }
    else {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/folder/files/${e.target.innerText}`, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(this.readyState !== 4) return;
            if(this.status === 200) {
                const res = JSON.parse(this.response);
                for(let i = 0; i < res.length; i++) {
                    let div_file = document.createElement('li');
                    div_file.className = 'div-file';
                    div_file.id = 'div_file';
                    div_file.setAttribute('draggable', true);
                    div_file.addEventListener('dragstart', dragStart);
                    div_file.addEventListener('dragend', dragEnd);
                    // div_file.addEventListener('drop', dragDrop);
                    let div_link = document.createElement('a');
                    div_link.innerText = res[i].Name + '.' + res[i].Extension;
                    div_link.href = "http://localhost:3000/api/files/download?filename=" + res[i].Name + "&extension=" + res[i].Extension;
                    let btn_delete = document.createElement('button');
                    btn_delete.type = 'button';
                    btn_delete.className = 'btn-delete';
                    btn_delete.innerText = 'Delete'
                    btn_delete.id = res[i].id;
                    btn_delete.setAttribute('filename', res[i].Name);
                    btn_delete.setAttribute('fileextension', res[i].Extension);
                    btn_delete.addEventListener('click', deleteFile.bind(this));
                    div_file.appendChild(div_link);
                    div_file.appendChild(btn_delete);
                    e.target.appendChild(div_file);
                    //document.getElementById('server-result').insertBefore(div_file, e.target.nextSibling);
                }
            }
            else console.log('Didn`t get folders with files');
        }
    }

}


function sendFile (e) {
    const formData = new FormData();
    formData.append('myFile', document.getElementById('input-upload').files[0], document.getElementById('input-upload').files[0].name);
    const folder = document.getElementsByName('input-chooseFolder')[0].value;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `/api/files/${folder}`);
    xhr.send(formData);
    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) return;
        if(this.status === 400) alert('This file already exists!');
        if(this.status === 200)
            deletethumbnail();
    }
}


function deleteFile(e) {
    const id = e.target.id;
    const name = e.target.getAttribute('filename');
    const extension = e.target.getAttribute('fileextension');
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/api/files', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({id:id, name:name, extension: extension}));
    xhr.onreadystatechange = function() {
        if(this.readyState !== 4) return;
        if(this.status === 200) {
            e.target.parentNode.remove();
        }
        else return;
    }
}


function createFolder(e) {
    const val = document.getElementsByName('input-folderName')[0].value;
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/newfolder', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({folderName: val}));
    xhr.onreadystatechange = function() {
        if(this.readyState !== 4) return;
        if(this.status === 200) {
            console.log('gotcha!');
            location.reload();
        }
        if(this.status === 400) {
            alert('Folder with this name already exists!');
        }
        else return;
    }
}


function handleFileSelect(evt) {
    const reader = new FileReader();  
    const file = evt.target.files[0];
    if (!file.type.match('image.*')) 
        return;

    // создает спан с превью картинки 
    reader.onload = (function(f) {
        return function(e) {
            if(document.getElementById('img-thumbnail') !== null) 
                document.getElementById('img-thumbnail').src = e.target.result;
            else {
                const span = document.createElement('span');
                span.id = 'span-thumbnail';
                span.className = "img-thumbnail";
                span.innerHTML = ['<img class="thumb" id="img-thumbnail" src="', e.target.result,
                        '" title="', escape(f.name), '"/><button onclick="deletethumbnail()" id="btn-exit" class="btn-exit">X</button>'].join('');
                document.getElementById('container').appendChild(span); 
            }   
            
        };
    })(file);

    reader.readAsDataURL(file);
}

//  функция удаляет спан с превью картинки
function deletethumbnail() {
    document.getElementById('span-thumbnail').remove();
    location.reload();
}

function dragStart(e) {
    const folder = e.target.previousSibling.innerText;
    console.log(e.target)
    e.dataTransfer.setData('Text', JSON.stringify({[folder]: e.target.innerText.slice(0, e.target.innerText.lastIndexOf('Delete'))}));
    console.log(e.target);
}

function dragEnter(e) {
    e.preventDefault();
    e.target.classList.toggle('div_info-dragEnter');
}

function dragLeave(e) {
    e.target.classList.toggle('div_info-dragEnter');
}

function dragEnd(e) {
    console.log('drag end');
}

function dragDrop(e) {
    e.target.classList.toggle('div_info-dragEnter');
    const file = JSON.parse(e.dataTransfer.getData('Text'));
    console.log(file)
    const folder = e.target.innerText;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `/api/${folder}/${JSON.stringify(file)}`, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if(this.readyState !== 4) return;
        else if(this.status === 200) {                                                              
            renderFolders();
        }
        else {
            console.log('something is wrong with moving pics')
        }
    }
}

function dragEnterFile(e) {
    e.target.classList.toggle('dropZoneEnter');
}

function dragLeaveFile(e) {
    e.target.classList.toggle('dropZoneEnter');
}

function dragOverFile(e) {
    e.preventDefault();
}

function dropFile(e) {
    e.preventDefault();
    e.stopPropagation();
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files)
}

function handleFiles(files) {
    ([...files]).forEach(sendFileDND)
}

function sendFileDND(file) {
    const folder = document.getElementsByName('input-chooseFolder')[0].value;
    if(folder.length !== 0) {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        xhr.open('POST', `/api/files/${folder}`);
        xhr.addEventListener('readystatechange', function(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                alert('good!')
            }
            else if (xhr.readyState == 4 && xhr.status != 200) {
                alert('bad');
            }
            })
            formData.append('file', file)
            xhr.send(formData)
    }
    else return;
}
import React from 'react';


export default class DropZone extends React.Component {


    
    handleDragEnter = (e) => {
        e.target.classList.add('dropZoneEnter');
    }
    
    handleDragLeave = (e) => {
        e.target.classList.remove('dropZoneEnter');
    }

    handleDragOver = (e) => {
        e.preventDefault();
    }

    handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let dt = e.dataTransfer;
        let files = dt.files;
        
        this.handleFiles(files)
    }

    handleFiles(files) {
        ([...files]).forEach(this.sendFileDND)
    }

    sendFileDND = (file) => {
        const folder = this.props.folder;
        if(folder.length !== 0) {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            xhr.open('POST', `/api/files/${folder}`);
            xhr.addEventListener('readystatechange', function(e) {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    this.props.setShowModal();
                }
                else if (xhr.readyState == 4 && xhr.status != 200) {
                    alert('bad');
                }
            }.bind(this))
                formData.append('file', file)
                xhr.send(formData);
        }
        else return;
    }
    

    render() {
        return (
            <div
                className='dropZone'
                id='dropZone'
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDragOver={this.handleDragOver}
                onDrop={this.handleDrop}
            >
                <div className='dropZoneText-container'>
                    Drop Here!
                </div>
            </div>
        )
    }
}
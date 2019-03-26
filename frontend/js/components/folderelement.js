import React from 'react';

export default class FolderElement extends React.Component {
    constructor(props) {
        super(props);

    }

    deleteFile = () => {
        const id = this.props.id;
        const name = this.props.name;
        const extension = this.props.ext;
        const folder = this.props.folder;
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/api/files', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({id:id, name:name, extension: extension, folder: folder}));
        xhr.onreadystatechange = function() {
            if(this.readyState !== 4) return;
        }
    }

    handleDragStart = (e) => {
        e.dataTransfer.setData('Text', [[this.props.folder], e.target.querySelector("[filename]").innerText]);
    }


    handleDragEnd = (e) => {
        this.props.setFolderSender(this.props.folder);
    }


    render() {
        return (
            <React.Fragment>
                <li 
                    className='li-file'
                    id='li_file'
                    draggable={true}
                    onDragStart={this.handleDragStart}
                    onDragEnd={this.handleDragEnd}
                >
                    <a  draggable="false"
                        filename="true"
                        href={'http://localhost:3000/api/files/download?filename=' + this.props.name + "&extension=" + this.props.ext}>
                        {this.props.name + '.' + this.props.ext}
                    </a>
                    <button 
                        type='button'
                        className='btn-delete'
                        onClick={this.deleteFile}
                    >
                        Delete!
                    </button>
                </li>
            </React.Fragment>
        )
    }
}
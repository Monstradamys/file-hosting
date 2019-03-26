import React from 'react';
import FolderElement from './folderelement';

export default class Folder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            opened: false
        };
    }


    getFolderFiles = (name) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `/api/folder/files/${name}`, true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(xhr.readyState !== 4) return;
            if(xhr.status === 200) {
                const res = JSON.parse(xhr.response);
                this.props.fillFolderWithFiles(name, res)
            }
        }.bind(this);
    }

    openFolder = () => {
        //console.log(this.props.name)
        this.setState({
            opened: !this.state.opened
        }, () => {
            if(this.state.opened) {
                this.getFolderFiles(this.props.name)
            }
        })
    }

    displayFolder = () => {
        if(this.state.opened && this.props.files !== null)
            return this.props.files.map((file) =>
                        <FolderElement 
                                    setFolderSender={this.props.setFolderSender}
                                    getFolderFiles={this.getFolderFiles}
                                    key={file.id}
                                    id={file.id}
                                    name={file.Name}
                                    ext={file.Extension}
                                    folder={file.folder}                         
                        />);
        else return null;
    }

    handleDragOver(e) {
        e.preventDefault();
    }


    // происходит в папке, куда перемещен файл
    handleDrop = (e) => {
        this.props.setFolderRecepient(this.props.name);
        const data = e.dataTransfer.getData('Text');
        const oldFolder = data.split(',')[0];
        const file = data.split(',')[1];
        const folder = this.props.name;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `/api/${folder}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json')
        xhr.send(JSON.stringify({[oldFolder] : file}));
        xhr.onreadystatechange = function() {
            if(xhr.readyState !== 4) return;
            else if(xhr.status === 200) {   
                this.getFolderFiles(this.props.folderSender);                                                       
                this.getFolderFiles(this.props.folderRecepient);
            }
            else {
                console.log('something is wrong with moving pics')
            }
        }.bind(this)
    }

    deleteFolder = () => {
        const folder = this.props.name;
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/api/folder', true)
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({name: folder}));
        xhr.onreadystatechange = function() {
            if(xhr.readyState !== 4) return;
            else if(xhr.status === 200) 
                this.props.getFolderNames();
            else console.log('cant delete folder!')
        }.bind(this)
    }

    render() {
        return (
            <div 
                id={this.props.id} 
                className='folder'
                
                onDragOver={this.handleDragOver}
                onDragEnter={this.handleDragEnter}
                onDragLeave={this.handleDragLeave}
                onDrop={this.handleDrop}
                draghere="true"
                >
                <h3 onClick={this.openFolder}>{this.props.name}</h3>
                <ul>
                    {this.displayFolder()}
                </ul>
                <button className='btn-delete-folder'
                    onClick={this.deleteFolder}
                >
                    Delete Folder
                </button>
            </div>
        ) 
    }
}
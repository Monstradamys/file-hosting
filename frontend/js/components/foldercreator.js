import React from 'react';

export default class FolderCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            folderName: ''
        }
    }
    
    setFolderName = (e) => {
        this.setState({
            folderName: e.target.value
        });
    }

    createNewFolder = () => {
        if(this.state.folderName.length === 0) {
            return;
        }
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'api/newfolder', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({folderName: this.state.folderName}));
        xhr.onreadystatechange = function() {
            if(this.readyState !== 4) return;
            if(this.status === 200) {
                console.log('New Folder was created!');
                location.reload();
            }
            if(this.status === 400) {
                alert('Folder with this name already exists!');
            }
            else return;
        }
    }

    closeFolderCreator = () => {
        if(this.props.createNewFolder === undefined)
            this.props.setShowFolderCreator();
        else this.props.createNewFolder()
    }

    render() {
        return (
            <div className='div-createFolder'>
                <input
                    type='text'
                    placeholder='Name your folder!'
                    name='input-folderName'
                    id='input-folderName'
                    className='input-folderName'
                    maxLength='32'
                    onChange={this.setFolderName}
                >
                </input>
                <button
                    type='button'
                    className='btn-folder'
                    id='btn-folder'
                    onClick={this.createNewFolder}
                >
                    Create your folder!
                </button>
                <button 
                    type='button'
                    className='btn-back'
                    onClick={this.closeFolderCreator}
                >
                    Back
                </button>
            </div>
        )
    }
}
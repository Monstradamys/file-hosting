import React from 'react';
import FolderCreator from './foldercreator';

export default class UploadForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foldersArray: [],
            showFolderCreator: false
        }
        this.mounted = false;
    }

    componentDidMount() {
        this.mounted = true;
        this.getFolderNames();
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    createNewFolder = () => {
        this.setState({
            showFolderCreator: !this.state.showFolderCreator
        })
    }

    openFolderCreator = () => {
        return this.state.showFolderCreator ? <FolderCreator createNewFolder={this.createNewFolder}/> : null
    }

    getFolderNames = () => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/folder', true);
        xhr.send();
        xhr.onreadystatechange = function() {
            if(xhr.readyState !== 4) return;
            if(xhr.status === 200) {
                const res = JSON.parse(xhr.response);
                if(this.mounted)
                    this.setState({
                        foldersArray: res
                    });
            }
            else console.log(' Cannot get folders from server! ');
        }.bind(this);
    }

    setFoldersName = () => {
        return this.state.foldersArray.map((folder) => 
            <option key={folder.id}>{folder.name}</option>
        )
    }

    getFolder = (e) => {
        this.props.setChosenFolder(e.target.value);
    }
    
    render() {
        return (
            <React.Fragment>
                <input 
                    list='folders' 
                    className='input-folder' 
                    placeholder='Choose your folder'
                    onChange={this.getFolder}
                />
                <datalist id='folders'>
                    {this.setFoldersName()}
                </datalist>
                <span> OR </span>
                <button className='btn-create'
                        type='button'
                        onClick={this.createNewFolder}
                >
                    Create a folder
                </button>
                {this.openFolderCreator()}
            </React.Fragment>
        )
    }
}
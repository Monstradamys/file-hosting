import React from 'react';
import Folder from './folder';

export default class FoldersContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foldersArray: [],
            folderSender: null,
            folderRecepient: null          
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

    setFolderSender = (val) => { this.setState({ folderSender: val})};
    setFolderRecepient = (val) => { this.setState({ folderRecepient: val})};

    fillFolderWithFiles = (name, res) => {
        const files = res;
        const folders = this.state.foldersArray;
        folders.map((folder) => {
            if(folder.name === name) folder.files = files;
        });
        this.setState({
            foldersArray: folders
        });
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

    displayFolders() {
        return this.state.foldersArray.map((folder) => 
            <Folder 
                folderSender={this.state.folderSender}
                folderRecepient={this.state.folderRecepient}
                setFolderRecepient={this.setFolderRecepient}
                setFolderSender={this.setFolderSender}
                fillFolderWithFiles={this.fillFolderWithFiles}
                getFolderNames={this.getFolderNames}
                name={folder.name} 
                key={folder.id} 
                id={folder.id}
                files={folder.files ? folder.files : null}
                />  
        )
    }


    render() {
        return (
            <div dontdraghere="true" className='server-result'>
                {this.displayFolders()}
            </div>
        )
    }
}
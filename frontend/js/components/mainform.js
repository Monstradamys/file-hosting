import React from 'react';
import FolderCreator from './foldercreator';
import DropZone from './dropzone';
import Modal from './modal';

export default class DownloadingContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            folder: '',
            showModal: false,
            showFolderCreator: false
        }
    }    

    setFolderName = (val) => {
        this.setState({
            folder: val
        })
    }

    setShowModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }

    setShowFolderCreator = () => {
        this.setState({
            showFolderCreator: !this.state.showFolderCreator
        })
    }

    openModal = () => {
        return this.state.showModal ? <Modal setShowModal ={this.setShowModal}/> : null;
    }

    openFolderCreator = () => {
        return this.state.showFolderCreator ? 
                (<div className='div-createFolder-wrapper'>
                    <FolderCreator setShowFolderCreator={this.setShowFolderCreator} />
                </div>) : null;
    }

    render() {
        return (
            <React.Fragment>
                <button type='button'
                        onClick={this.setShowModal}
                        className='btn-upload'>
                    Upload new file
                </button>
                {this.openModal()}
                <button type='button'
                        onClick={this.setShowFolderCreator}
                >
                    Create New Folder
                </button>
                {this.openFolderCreator()}                  
            </React.Fragment>
        )
    }
}
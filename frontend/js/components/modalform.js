import React from 'react';
import UploadForm from './uploadform';
import UploadFile from './uploadfile';
import DropZone from './dropzone';

export default class ModalForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chosenFolder: ''
        }
    }

    setChosenFolder = (val) => {
        this.setState({
            chosenFolder: val
        })
    }

    handleDragEnter = (e) => {
        if(e.target.nodeName === 'DIV')
            document.getElementById('dropZone').classList.add('active');
    }

    handleDragLeave = (e) => {
        if(e.clientY <= 0 || e.clientX <= 0 || (e.clientX >= window.innerWidth || e.clientY >= window.innerHeight))
            if(e.target.nodeName === 'DIV')
                document.getElementById('dropZone').classList.remove('active');
    }

    render() {
        return (
            <React.Fragment>
                <div className='div-back' 
                    onDragEnter={this.handleDragEnter}
                    onDragLeave={this.handleDragLeave}
                >
                    <form
                        action='/api/files'
                        method='POST'
                        encType='multipart/form-data'
                        className='form-modal'
                    >
                        <UploadForm setChosenFolder={this.setChosenFolder}/>
                        <UploadFile 
                                chosenFolder={this.state.chosenFolder}
                                setShowModal={this.props.setShowModal}
                        />
                        <button type='button'
                                onClick={this.props.setShowModal}
                                className='btn-back'
                        >
                            Back
                        </button>
                        <DropZone   folder={this.state.chosenFolder}
                                    setShowModal={this.props.setShowModal}
                        />
                    </form>  
                </div> 
            </React.Fragment>
            
        )
    }
}
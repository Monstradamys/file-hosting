import React from 'react';

export default class UploadFile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: ''
        }
    }

    chooseFile = (e) => {
        const reader = new FileReader();
        const file = e.target.files[0];

        this.setState({
            file: e.target.files[0]
        });
        if (!file.type.match('image.*')) 
            return;

        reader.readAsDataURL(file);
    }

    fillPreview = () => {
        if(this.state.file !== '')
            return <h3> {this.state.file.name} </h3>;
        else return;
    }


    sendFile = () => {
        if(this.props.chosenFolder !== '') {
            const formData = new FormData();
            formData.append('myFile', this.state.file, this.state.file.name);
            const folder = this.props.chosenFolder;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `/api/files/${folder}`);
            xhr.send(formData);
            xhr.onreadystatechange = function() {
                if (xhr.readyState !== 4) return;
                if (xhr.status === 400) alert('xhr file already exists!');
                if (xhr.status !== 400 || xhr.status !== 404) {
                    this.setState({
                        file: ''
                    });
                }
            }.bind(this)
            this.props.setShowModal();
        }
    }


    render() {
        return (
            <React.Fragment>
                <h3>Drop your File here</h3>
                <span>OR</span> 
                <label htmlFor='input-upload'>
                    Choose your File
                </label>
                <input
                    type='file'
                    name='input-upload'
                    id='input-upload'
                    className='input-upload hide'
                    onChange={this.chooseFile}
                />
                <div className='div-preview'>
                    {this.fillPreview()}
                </div>
                <button className='btn-send'
                    onClick={this.sendFile}
                    type='button'
                >
                    Send    
                </button>
            </React.Fragment>
        )
    }
}
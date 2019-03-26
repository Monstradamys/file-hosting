import React from 'react';
import ReactDOM from 'react-dom';
import ModalForm from './ModalForm.js';


function Modal(props) {
    return  ReactDOM.createPortal( <ModalForm {...props} />,
            document.getElementById('modal'));
}

export default Modal;
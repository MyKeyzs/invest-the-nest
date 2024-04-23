import React from 'react'
import ReactDOM from 'react-dom';

interface ModalProps  {
    onBackdropClick: () => void;
}

const Modal: React.FC<ModalProps> = ({onBackdropClick, children}) => {
  return ReactDOM.createPortal(<div onClick ={onBackdropClick}>
    <span>Login Modal</span>
  </div>, document.getElementById('modal-root')!);
  
}

export default Modal
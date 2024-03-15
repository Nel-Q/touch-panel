import React, {useEffect, useRef} from 'react';
import { Button } from 'react-bootstrap';
import BackArrow from './Icons/arrow-left.svg';
import X from './Icons/x.svg'

const CModal = ({ show, onHide, title, children }) => {
  const modalRef = useRef(null);
  useEffect(() => {
    const modalElement = modalRef.current;

    if (modalElement) {
      if (show) {
        modalElement.classList.add('show');
        document.body.classList.add('modal-open');
      } else {
        modalElement.classList.remove('show');
        document.body.classList.remove('modal-open');
      }
    }
  }, [show]);
  return (
    <div className={`modal ${show ? 'show' : ''} align-middle` }  role="dialog" ref={modalRef}
        style={{display: show ? 'block' : 'none', backgroundColor:'rgba(0,0,0,0.3'}}>
      <div className="modal-dialog row" role="document">
        <div className="modal-content">
          <div className="modal-header bg-secondary d-flex justify-content-between align-items-center">
            <div className='row'>
              <Button variant="link" onClick={onHide} className="btn-close text-white border-0">
                      <img
                          src={BackArrow}
                          alt='Back arrow'
                          className='img-fluid' />
              </Button>
            <h5 className='modal-title text-black'>{title}</h5>
            </div>
            
            <Button variant="link" onClick={onHide} className="btn-close text-white border-0">
                    <img
                        src={X}
                        alt='X'
                        className='img-fluid' />
            </Button>
          </div>
          <div className="modal-body text-black">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CModal;

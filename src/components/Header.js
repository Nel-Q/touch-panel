import React, { useEffect, useState } from 'react';
import './Header.css'
import logo from "./Icons/Northwestern_WHITE.svg"
import CModal from './CModal';


function Header(){
    const [classRoom, setClassRoom] = useState("");
    const [showHelpModal, setShowHelpModal] = useState(false);
    const handleShowHelpModal = () => {
        console.log("Showing Modal")
        setShowHelpModal(true);
      }
      const handleCloseHelpModal = () => {
        setShowHelpModal(false);
      }
    useEffect(() =>{
        window.CrComLib.subscribeState('s','1', value=> setClassRoom(value));
        console.log(classRoom)
    }, [])
    
    
    return(
        <div className='row p-0 m-0 headerRow'>
            <div className="col-12 d-flex flex-row justify-content-evenly align-items-center  font-size-3 font-size-4-xl p-0" style={{ backgroundColor: 'var(--primary)' }}>
                    <div className="col-3">
                        <img
                            src={logo}
                            alt="Northwestern Logo"
                            className='img-fluid'
                            style={{width:'12em', height:'auto'}}/>
                    </div>
                    <div className="col-3 text-center text-white">
                        <span>{(classRoom == "") ? 'Room ABCD' : classRoom}</span>
                    </div>
                    <div className="col-4 text-center text-white">
                                <span className="d-block mb-2">
                                    <ch5-datetime 
                                        displaytype="date" 
                                        styleForDate="MMMM d, yyyy">
                                    </ch5-datetime>
                                </span>    
                                <span className='d-inline-block'>
                                    <ch5-datetime 
                                        displaytype="time">
                                    </ch5-datetime>
                                </span>
                    </div>
                    <div className="col-2 text-white text-center">
                    <button type="button"
                        className="btn d-flex align-items-center rounded-circle mx-auto text-white font-size-4 font-size-5-xl circleIcon" style={{backgroundColor: '#007FA4'}} onClick={handleShowHelpModal}>
                        <i className="d-inline-block bi bi-question-lg mx-auto"></i>
                    </button>
                    </div>
                    <div>
                    <CModal show={showHelpModal} onHide={handleCloseHelpModal} title='Help' className="justify-content-center">
                        <div className='content col-10 align-items-center ml-5 pl-5 pt-5'>
                            <h5 className='align-items-center'>Please use the number below to call our support team for assistance</h5>
                            <h5 className='text-info'>847-467-7666</h5>
                            <h5>You are currently in room:</h5>
                            <h5 className='text-info'>{(classRoom == "") ? 'Room ABCD' : classRoom}</h5>
                        </div>
                        
                    </CModal>
                    </div>

           </div>   
        </div>
    );

}


export default Header;
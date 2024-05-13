import React, { useEffect, useState, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import './Header.css'
import logo from "./Icons/Northwestern_WHITE.svg"
import { useNavigate } from 'react-router-dom';


function Header(){
    const [classRoom, setClassRoom] = useState("");
    const [ipAdd, setIpAdd] = useState('')
    const [configRoomName, setConfigRoomName] = useState('')
    const [configIpAdd, setConfigIpAdd] = useState('');
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [fullscreen, setFullscreen] = useState(true);
    const [pwValue, setPwValue] = useState('');
    const [textFieldsNum, setTextFieldsNum] = useState(0);
    const [textFields, setTextFields] = useState([])
    const [textFieldsValues, setTextFieldsValues] = useState([]);
    const [toggleButtons, setToggleButtons] = useState([]);
    const [toggleButtonsNum, setToggleButtonsNum] = useState(0);
    const [toggleButtonsStates, setToggleButtonsStates] = useState([])
    const [tempField, setTempField] = useState('');
    const [tempValue, setTempValue] = useState(0);
    const [tempToggleText, setTempToggleText] = useState('');
    const [tempToggleState, setTempToggleState] = useState(false);
    const [showSaveAlert, setShowSaveAlert] = useState(false);
    const [showResetAlert, setShowResetAlert] = useState(false);

    const navigate = useNavigate();
    useEffect(() =>{
        window.CrComLib.subscribeState('s','1', value=> setClassRoom(value));
        window.CrComLib.subscribeState('s','2', value=> setIpAdd(value));
        window.CrComLib.subscribeState('b', '121', value=> setShowPasswordModal(value));
        window.CrComLib.subscribeState('b', '93', value=> setShowAdminModal(value));
        window.CrComLib.subscribeState('s','25', value => setPwValue(value));
        window.CrComLib.subscribeState('n','22', value => setTextFieldsNum(value));
        window.CrComLib.subscribeState('n','21', value => setToggleButtonsNum(value));
        setTextFields(Array(textFieldsNum).fill('').map((_, index) =>{
            let value;
            window.CrComLib.subscribeState('s', `${index + 71}`, incomingValue => {
              value = incomingValue;
              setTempField(value)
            //   console.log('temp field', tempField)
            });
            return value;
          }));
          
        setTextFieldsValues(Array(textFieldsNum).fill('').map((_, index) =>
            {
            let value;
            window.CrComLib.subscribeState('n', `${index + 23}`, incomingValue => {
                value = incomingValue;
                setTempValue(value)
                
            });
            return value;
            }));
        setToggleButtons(Array(toggleButtonsNum).fill('').map((_, index) =>{
            let value;
            window.CrComLib.subscribeState('s', `${index + 51}`, incomingValue => {
                value = incomingValue;
                setTempToggleText(value)
               
            });
            return value;
            }));
        setToggleButtonsStates(Array(toggleButtonsNum).fill('').map((_, index) =>{
            let value;
            window.CrComLib.subscribeState('b', `${index + 331}`, incomingValue => {
                value = incomingValue;
                setTempToggleState(value)
               
            });
            return value;
            }));
        if (configRoomName === '') {
            setConfigRoomName(classRoom);
            }
        if (configIpAdd === '') {
            setConfigIpAdd(ipAdd);
            }
    }, [pwValue, textFieldsNum, toggleButtonsNum, textFieldsValues, toggleButtonsStates]);
    

    
    const handleShowHelpModal = () => {
        console.log("Showing Help Modal")
        setShowHelpModal(true);
        window.CrComLib.publishEvent('b', '150', true);
        window.CrComLib.publishEvent('b', '150', false);
      }
    const handleCloseHelpModal = () => {
        console.log("Closing Help Modal")
        setShowHelpModal(false);
        window.CrComLib.publishEvent('b', '151', true);
        window.CrComLib.publishEvent('b', '151', false);
      }
    const handleShowAdminModal = () => {
        window.CrComLib.publishEvent('b', '130', true);
        window.CrComLib.publishEvent('b', '130', false)
     }
    const handleCloseAdminModal = () => {
        
        window.CrComLib.publishEvent('b', '123', true);
        window.CrComLib.publishEvent('b', '123', false);
        navigate('/HomePage');
    }

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
        window.CrComLib.publishEvent('b', '122', true);
        window.CrComLib.publishEvent('b', '122', false);
        console.log('Closing Password Modal')
    }

    const handleAdminLongPress = () => {
        window.CrComLib.publishEvent('b', '120', true);
      };
    const handlePwKeyPres = (joinNumber) => {
        window.CrComLib.publishEvent('b', `${joinNumber}`, true);
        window.CrComLib.publishEvent('b', `${joinNumber}`, false);
        console.log('pw key pressed', joinNumber)
    };
    const handleSaveConfig = () => {
        window.CrComLib.publishEvent('s', '5', configRoomName);
        window.CrComLib.publishEvent('s', '6', configIpAdd);
        window.CrComLib.publishEvent('b', '124', true);
        window.CrComLib.publishEvent('b', '124', false);
        setShowSaveAlert(true);
    };

    const handleCloseSaveAlert = () => {
        setShowSaveAlert(!showSaveAlert);
    };
    const handleResetConfig = () => {
        window.CrComLib.publishEvent('b', '125', true);
        window.CrComLib.publishEvent('b', '125', false);
        setConfigRoomName(classRoom);
        setConfigIpAdd(ipAdd);
        setShowResetAlert(true);
        
    }
    const handleCloseResetAlert = () => {
        setShowResetAlert(!showResetAlert);
    };
    
    const handleIncreaseOrDecrease = (joinNumber, currIdx) => {
        window.CrComLib.publishEvent('b', `${joinNumber}`, true);
        window.CrComLib.publishEvent('b', `${joinNumber}`, false);
        console.log('join pressed', joinNumber)
        console.log('current index is', currIdx)
    }
    const handleRoomNameChange = (event) => {
        setConfigRoomName(event.target.value);
        console.log('config room name is: ', configRoomName)
        console.log('room name is ', classRoom)
    }
    const handleIpChange = (event) => {
        setConfigIpAdd(event.target.value);
        console.log('config ip add is ', configIpAdd);
        console.log('ip add is ', ipAdd)

    }
    
    const handleToggleStateChange = (joinNumber) => {
        window.CrComLib.publishEvent('b', `${joinNumber}`, true);
        window.CrComLib.publishEvent('b', `${joinNumber}`, false);
        console.log('toggle state changed', joinNumber)
    }

    return(
        <div className='row p-0 m-0 headerRow'>
            <div className="col-12 d-flex flex-row justify-content-around align-items-center bg-primary font-size-3 font-size-4-xl p-0">
                    <div className="col-3">
                        <img src={logo} alt='Northwestern Logo' className='img-fluid'/>
                    </div>
                    <div className="col-1 text-center p-0">
                        <div className="text-primary py-3 py-xl-4 font-size-1"
                            onMouseDown={handleAdminLongPress}
                            onMouseUp={() => window.CrComLib.publishEvent('b', '120', false)}
                            onTouchStart={handleAdminLongPress}
                            onTouchEnd={() => window.CrComLib.publishEvent('b', '120', false)}
                            onMouseLeave={() => window.CrComLib.publishEvent('b', '120', false)}
                        >
                        admin button
                        </div>
                    </div>
                    <div className="col-2 text-center text-white">
                        <span>{(classRoom == "") ? 'Room' : classRoom}</span>
                    </div>
                    <div className="col-3 text-center text-white font-size-2 font-size-3-xl">
                                <span className="d-block mb-1">
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
                    <div className="col-1 text-white text-center">
                    <button
                        className="btn btn-info d-flex align-items-center rounded-circle p-0 mx-auto text-white font-size-3 font-size-4-xl circleIcon" onClick={handleShowHelpModal}>
                        <i className="d-inline-block bi bi-question-lg mx-auto"></i>
                    </button>
                    </div>
                <div>

                    {/* Help Modal */}
                    <Modal show={showHelpModal} onHide={handleCloseHelpModal} fullscreen={fullscreen}>
                        <Modal.Header className="pb-0">
                            <Modal.Title className="col-12 d-flex flex-row justify-content-between">
                                <h1 className="font-size-5 font-size-6-xl">
                                    <button type="button" className="border-0 text-dark"
                                        onClick={handleCloseHelpModal}><i class="bi bi-arrow-left"></i></button>Help</h1>
                                <button type="button" className="border-0 text-muted"
                                    onClick={handleCloseHelpModal}><i class="bi bi-x-lg"></i></button>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="font-size-4 font-size-5-xl p-4 p-xl-5">
                            <div className='container-fluid text-center'>
                                    <p>Please use the number below to call our support team for assistance.</p>
                                    <span className="d-block text-info fw-bold mt-5">7-ROOM</span>
                                    <span className="d-block text-muted mb-5">(847-467-7666)</span>
                                    <p>You are currently in room:</p>
                                    <span className='text-info fw-bold'>
                                    {(classRoom == "") ? 'Room' : classRoom}
                                </span>
                            </div>
                        </Modal.Body>
                    </Modal>

                     {/* Password Modal */}
                     <Modal show={showPasswordModal} fullscreen={fullscreen}>
                        <Modal.Header className="pb-1">
                            <Modal.Title className="col-12 d-flex flex-row justify-content-between">
                                <h1 className="font-size-5 font-size-6-xl">
                                    <button type="button" className="border-0 text-dark"
                                        onClick={handleClosePasswordModal}><i class="bi bi-arrow-left"></i></button>Password Required</h1>
                                <button type="button" className="border-0 text-muted font-size-3 font-size-5-xl"
                                    onClick={handleClosePasswordModal}><i class="bi bi-x-lg"></i></button>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="font-size-4 font-size-5-xl p-0 pt-1">
                            <div className='container-fluid overflow-y-auto'>
                            <div className="d-flex flex-wrap col-4 justify-content-around pt-3 pt-xl-5 mx-auto">
                                <div className="d-flex flex-row col-12 justify-content-center align-items-center">
                                <div className="col-9">
                                    <input className="form-control border-0 rounded-pill bg-gray-300 text-muted text-center font-size-1 font-size-3-xl p-3 mb-3"
                                    placeholder='' 
                                    value={pwValue}/>
                                </div>
                                <div className="col-2 text-center p-0" 
                                    onClick={() => {
                                        window.CrComLib.publishEvent('b', '129', true);
                                        window.CrComLib.publishEvent('b', '129', false);
                                    }}>
                                    <i className="bi bi-backspace-fill"></i>
                                </div>
                                </div>
                                <Button className="btn btn-gray rounded-circle border-0 p-0 mb-2 mb-xl-3 mx-2 dialpadButton"
                                    onClick={() => handlePwKeyPres('131')}>
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">1</span>
                                </Button>
                                <Button className="btn btn-gray rounded-circle border-0 p-0 mb-2 mb-xl-3 mx-2 dialpadButton"
                                    onClick={() => handlePwKeyPres('132')}>
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">2</span>
                                </Button>
                                <Button className="btn btn-gray rounded-circle border-0 p-0 mb-2 mb-xl-3 mx-2 dialpadButton"
                                    onClick={() => handlePwKeyPres('133')}>
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">3</span>
                                </Button>
                                <Button className="btn btn-gray rounded-circle border-0 p-0 mb-2 mb-xl-3 mx-2 dialpadButton"
                                    onClick={() => handlePwKeyPres('134')}>
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">4</span>
                                </Button>
                                <Button className="btn btn-gray rounded-circle border-0 p-0 mb-2 mb-xl-3 mx-2 dialpadButton"
                                    onClick={() => handlePwKeyPres('135')}>
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">5</span>
                                </Button>
                                <Button className="btn btn-gray rounded-circle border-0 p-0 mb-2 mb-xl-3 mx-2 dialpadButton"
                                    onClick={() => handlePwKeyPres('136')}>
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">6</span>
                                </Button>
                                <Button className="btn btn-gray rounded-circle border-0 p-0 mb-2 mb-xl-3 mx-2 dialpadButton"
                                    onClick={() => handlePwKeyPres('137')}>
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">7</span>
                                </Button>
                                <Button className="btn btn-gray rounded-circle border-0 p-0 mb-2 mb-xl-3 mx-2 dialpadButton"
                                    onClick={() => handlePwKeyPres('138')}>
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">8</span>
                                </Button>
                                <Button className="btn btn-gray rounded-circle border-0 p-0 mb-2 mb-xl-3 mx-2 dialpadButton"
                                    onClick={() => handlePwKeyPres('139')}>
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">9</span>
                                </Button>
                                <Button className="btn btn-gray rounded-circle border-0 p-0 mb-2 mb-xl-3 mx-2 dialpadButton"
                                    onClick={() => handlePwKeyPres('140')}>
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">0</span>
                                </Button>
                                <Button className="btn btn-gray col-8 rounded-pill border-0 p-0 mb-2 mb-xl-3">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl" onClick={handleShowAdminModal}>Enter</span>
                                </Button>
                            </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                    
                    {/* Admin Modal */}
                    <Modal show={showAdminModal} onHide={handleCloseAdminModal} fullscreen={fullscreen}>
                        <Modal.Header className="p-0 py-2">
                            <Modal.Title className="col-12 d-flex flex-row justify-content-between">
                                <h1 className="font-size-4 font-size-5-xl">
                                    <button type="button" className="border-0 text-dark"
                                        onClick={handleCloseAdminModal}><i class="bi bi-arrow-left"></i></button>Admin</h1>
                                <button type="button" className="border-0 text-muted font-size-3 font-size-5-xl"
                                    onClick={handleCloseAdminModal}><i class="bi bi-x-lg"></i></button>
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="font-size-4 font-size-5-xl p-0 pt-1">
                            <div className='container-fluid p-0'>
                                <Alert
                                    className={`col-8 font-size-2 font-size-3-xl my-3 mx-auto`}
                                    show={showSaveAlert}
                                    variant="success"
                                >
                                    <Alert.Heading className="col-12 d-flex flex-row justify-content-between">
                                        <h4 className="font-size-2 font-size-3-xl fw-bold">Saved!</h4>
                                        <button
                                            type="button"
                                            className="btn alert-success shadow-none border-0 text-muted p-0 font-size-3 font-size-4-xl"
                                            onClick={() => setShowSaveAlert(false)}>
                                            <i class="bi bi-x-lg"></i></button>
                                    </Alert.Heading>
                                    <p>
                                        Your changes have been saved.
                                    </p>
                                </Alert>
                                <Alert
                                    className={`col-8 font-size-2 font-size-3-xl my-3 mx-auto`}
                                    show={showResetAlert}
                                    variant="success" 
                                >
                                    <Alert.Heading className="col-12 d-flex flex-row justify-content-between">
                                    <h4 className="font-size-2 font-size-3-xl fw-bold">Settings Reset!</h4>
                                    <button
                                            type="button"
                                            className="btn alert-success shadow-none border-0 text-muted p-0 font-size-3 font-size-4-xl"
                                            onClick={() => setShowResetAlert(false)}>
                                            <i class="bi bi-x-lg"></i></button>
                                    </Alert.Heading>
                                    <p>
                                        The settings have been reset.
                                    </p>
                                </Alert>
                                <div className="row flex-wrap align-items-start justify-content-around pt-1">
                                    <div className="col-5 d-flex flex-row align-items-start p-0 mb-2 mb-xl-2">
                                            <Form.Group className="col mb-3" controlId="roomName">
                                                <Form.Label className="font-size-2 font-size-3-xl">Room Name</Form.Label>
                                                <Form.Control className="font-size-2 font-size-3-xl p-3" type="text/input" placeholder={classRoom} 
                                                    value={configRoomName} onChange={handleRoomNameChange}/>
                                            </Form.Group>
                                    </div>
                                    <div className="col-5 d-flex flex-row align-items-start p-0 mb-2 mb-xl-2">
                                        <Form.Group className="col mb-3" controlId="wirelessAddress">
                                                <Form.Label className="font-size-2 font-size-3-xl">Wireless Address</Form.Label>
                                                <Form.Control className="font-size-2 font-size-3-xl p-3" type="text/input" placeholder={ipAdd} 
                                                    value={configIpAdd} onChange={handleIpChange} />
                                            </Form.Group>
                                    </div>
                                </div>
                                {/* HDMI Switcher row */}
                                <div className="row flex-wrap justify-content-around mt-1 mb-4 font-size-2 font-size-4-xl">
                                    <h3 className="text-center fw-bold mb-4 font-size-2 font-size-4-xl">Enter input # of HDMI switcher or 0 for none</h3>
                                    {/* HDMI Switcher */}
                                    
                                    {Array.from({ length: textFieldsNum }, (_, index) => (
                                        <div className="col-5 h-100">
                                            <div key={index} className="d-flex flex-row align-items-center mb-2 mb-xl-3">
                                                <div className="col-6 font-size-2 font-size-3-xl">
                                                    <span>{textFields[index]}</span>
                                                    <span>: </span>
                                                    <span className="fw-bold"> {textFieldsValues[index]}</span>
                                                </div>
                                                <div className="col-6 text-center">
                                                    <div className="btn-group mb-1" role="group" aria-label="Zoom buttons">
                                                        <button type="button" className="btn btn-info border-0 rounded-start-pill text-white px-3 px-xl-4 py-1 font-size-2 font-size-3-xl"
                                                            onClick={() => handleIncreaseOrDecrease(`${index * 2 + 361 + 1}`, index)}><i className="bi bi-dash-circle-fill"></i></button>
                                                        <button type="button" className="btn btn-info border-0 rounded-end-pill text-white px-3 px-xl-4 py-1  font-size-2 font-size-3-xl"
                                                            onClick={() => handleIncreaseOrDecrease(`${index * 2 + 361}`, index)}><i className="bi bi-plus-circle-fill"></i></button>
                                                        
                                                    </div>
                                                </div>
                                            </div> 
                                        </div>
                                    ))}
                                </div>
                                {/* /HDMI button row */}
                                <div className="row flex-wrap justify-content-around px-3 my-5">
                                    {Array.from({ length: toggleButtonsNum }, (_, index) => (
                                        <button key={index} className={`btn col-5 rounded-pill border-0 p-2 me-2 mb-3 font-size-2 font-size-3-xl adminPresetButton
                                            ${(toggleButtonsStates[index]) ? 'btn-info' : 'btn-gray'}`}
                                            onClick={() => handleToggleStateChange(`${index + 331}`)}>
                                            {toggleButtons[index]}
                                        </button>
                                    ))}
                                    
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer className="p-0 py-2">
                            <Button variant="secondary" className="font-size-2 font-size-4-xl mx-2" onClick={handleCloseAdminModal}><i className="bi bi-x-circle me-1"></i> Cancel</Button>
                            <Button variant="info" className="font-size-2 font-size-4-xl mx-2" onClick={handleResetConfig}><i className="bi bi-arrow-clockwise me-1"></i>Reset</Button>
                            <Button variant="primary" className="font-size-2 font-size-4-xl mx-2" onClick={handleSaveConfig}> <i className="bi bi-floppy-fill me-1"></i>Save changes</Button>
                        </Modal.Footer>
                    </Modal>
                    </div>

           </div>   
        </div>
    );

}


export default Header;

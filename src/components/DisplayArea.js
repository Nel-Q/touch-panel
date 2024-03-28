import * as React from 'react';
import { useState, useEffect } from "react";
import { Button, Row, Col} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import CModal from './CModal';
import Opad from './Opad';

function DisplayArea({sourceSelected, displayJoin, side, showAnnotationJoin, showFullScreenJoin,
     annotationJoin, fullscreenJoin, powerOn, powerOff, upJoin, downJoin}) {
    const [ipAdd, setIpAdd] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [bluRayClicked, setBluRayClicked] = useState(false);
    const [confCallClicked, setConfCallClicked] = useState(false);
    const [blurayButton, setBluRayButton] = useState('');
    const [powerSwitch, setPowerSwitch] = useState(true);
    const [lampSwitch, setLampSwitch] = useState(true);
    const [autoFocusSwitch, setAutoFocusSwitch] = useState(true);
    const [showAnnotation, setShowAnnotation] = useState(false);
    const [showFullScreen, setShowFullScreen] = useState(false);
    const [annotationPressed, setAnnotationPressed] = useState(false);
    const [fullscreenPressed, setFullscreenPressed] = useState(false);
    const [fullscreen, setFullscreen] = useState(true);
    useEffect(() => {
        window.CrComLib.subscribeState('s', '2', value=> setIpAdd(value));
        window.CrComLib.subscribeState('b', `${showAnnotationJoin}`, value=> setShowAnnotation(value));
        window.CrComLib.subscribeState('s', `${showFullScreenJoin}`, value=> setShowFullScreen(value)); 
        
    }, []);
    const toggleMute = (joinNumber) => {
        setIsMuted((prevIsMuted) => !(prevIsMuted));
        if (isMuted) {
            window.CrComLib.publishEvent('b', `${joinNumber}`, false);
            console.log('display unmuted')
        } else{
            window.CrComLib.publishEvent('b', `${joinNumber}`, true);
            console.log('display muted')
        }
    }
    const handleShowDisplayModal = () => {
        console.log("Showing Display Modal")
        setIsClicked(true);
      }
    const handleCloseDisplayModal = () => {
        setIsClicked(false);
    }
    const handleShowBluRayModal = () => {
        console.log("Showing BluRay Modal")
        setBluRayClicked(true);
    }
    const handleCloseBluRayModal = () => {
        console.log("Closing BluRay Modal")
        setBluRayClicked(false);
    }
    const handleShowConfCallModal = () => {
        console.log("Showing ConfCall Modal")
        setConfCallClicked(true);
    }
    const handleCloseConfCallModal = () => {
        console.log("Closing ConfCall Modal")
        setConfCallClicked(false);
    }
    const togglePowerSwitch = () => {
        setPowerSwitch(!powerSwitch)
        if (!powerSwitch) {
            window.CrComLib.publishEvent('b', `${powerOn}`, true);
            window.CrComLib.publishEvent('b', `${powerOn}`, false);
            console.log('Power On')
        } else {
            window.CrComLib.publishEvent('b', `${powerOff}`, true);
            window.CrComLib.publishEvent('b', `${powerOff}`, false);
            console.log('Power Off')
        }
    }
    const toggleLampSwitch = () => {
        setLampSwitch(!lampSwitch)
        if (!lampSwitch) {
            window.CrComLib.publishEvent('b', '85', true);
            window.CrComLib.publishEvent('b', '85', false);
            console.log('Lamp On')
        } else {
            window.CrComLib.publishEvent('b', '86', true);
            window.CrComLib.publishEvent('b', '86', false);
            console.log('Lamp Off')
        }
    }
    const toggleAutoFocusSwitch = () => {
        setAutoFocusSwitch(!autoFocusSwitch)
        if (!autoFocusSwitch) {
            window.CrComLib.publishEvent('b', '81', true);
            window.CrComLib.publishEvent('b', '81', false);
            console.log('AutoFocus On')
        } else {
            window.CrComLib.publishEvent('b', '82', true);
            window.CrComLib.publishEvent('b', '82', false);
            console.log('AutoFocus Off')
        }
    }

    const handleAnnotationPressed = () => {
        setAnnotationPressed(!annotationPressed)
        if (!powerSwitch) {
            window.CrComLib.publishEvent('b', `${annotationJoin}`, true);
            window.CrComLib.publishEvent('b', `${annotationJoin}`, false);
            console.log('Power On')
        } else {
            window.CrComLib.publishEvent('b', `${annotationJoin}`, true);
            window.CrComLib.publishEvent('b', `${annotationJoin}`, false);
            console.log('Power Off')
        }
    }
    const handleFullscreenPressed = () => {
        setFullscreenPressed(!fullscreenPressed)
        if (!powerSwitch) {
            window.CrComLib.publishEvent('b', `${fullscreenJoin}`, true);
            window.CrComLib.publishEvent('b', `${fullscreenJoin}`, false);
            console.log('Power On')
        } else {
            window.CrComLib.publishEvent('b', `${fullscreenJoin}`, true);
            window.CrComLib.publishEvent('b', `${fullscreenJoin}`, false);
            console.log('Power Off')
        }
    } 
    const blurayControl = (joinNumber, press) => {
        setBluRayButton(press)
        window.CrComLib.publishEvent('b', `${joinNumber}`, true);
        window.CrComLib.publishEvent('b', `${joinNumber}`, false);
        console.log(`${press} pressed`)
        console.log(blurayButton)
    }
    let message;
    let displayNum;
    switch (side) {
        case 'left':
            displayNum = "One"
            break;
        case 'right':
            displayNum = "Two"
            break;
    } 
    switch(sourceSelected) {
        case 'PC':
            message = <p>Please use the keyboard and mouse to start.</p>;
            break;
        case 'Laptop':
            message = <p>Connect your device to start presenting.</p>;
            break;
        case 'Wireless':
            message = <span>
                <p>Enter the address below into your browser and follow the instructions
                    to present wirelessly.
                </p>
                <p className='text-info'>{(ipAdd == "") ? "123.210.123.210" : ipAdd}</p>
                </span>
            ;
            break;
        case 'ConfCall':
            message = <span>
                <p>Select the button below to dial your number.</p>
                <Button 
                className="btn btn-info rounded-pill border-0 px-3 mt-3 font-size-3 font-size-4-xl"
                onClick={handleShowConfCallModal}
                >Conference Call</Button>
                {/* Conference Call Modal */}
                <Modal show={confCallClicked} onHide={handleCloseConfCallModal} fullscreen={fullscreen}>
                    <Modal.Header closeButton className="pb-0">
                        <Modal.Title>
                            <h1 className="font-size-5 font-size-6-xl"><button type="button" className="border-0 text-dark"
                                onClick={handleCloseConfCallModal}><i className="bi bi-arrow-left"></i></button>Conference Call</h1>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="font-size-2 font-size-3-xl p-0">
                        <div className='container-fluid text-center pt-3 pt-xl-5'>
                            <div className="d-flex flex-wrap col-3 col-xl-3 justify-content-around mx-auto">
                                <div className="d-flex flex-row col-12 justify-content-between">
                                <div className="col-10">
                                    <input className="form-control border-0 rounded-pill bg-gray-300 text-muted text-center font-size-1 font-size-3-xl p-2 mb-3"
                                    placeholder='847-555-5555' />
                                </div>
                                <div className="col pt-2">
                                <i className="bi bi-backspace-fill"></i>
                                </div>
                                </div>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">1</span>
                                    <span className="d-block font-size-1" style={{height: 'var(--font-size-2'}}></span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">2</span>
                                    <span className="d-block font-size-1 font-size-2-xl">ABC</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">3</span>
                                    <span className="d-block font-size-1 font-size-2-xl">DEF</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">4</span>
                                    <span className="d-block font-size-1 font-size-2-xl">GHI</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">5</span>
                                    <span className="d-block font-size-1 font-size-2-xl">JKL</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">6</span>
                                    <span className="d-block font-size-1 font-size-2-xl">MNO</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">7</span>
                                    <span className="d-block font-size-1 font-size-2-xl">PQRS</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">8</span>
                                    <span className="d-block font-size-1 font-size-2-xl">TUV</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">9</span>
                                    <span className="d-block font-size-1 font-size-2-xl">WXYZ</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">*</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">0</span>
                                    <span className="d-block font-size-1 font-size-2-xl">+</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">#</span>
                                </Button>
                                <Button className="btn rounded-circle border-0 bg-gray-300 text-dark p-0 mb-2 dialpadButton">
                                    <span className="d-block fw-bold font-size-4 font-size-5-xl">
                                        <i className="bi bi-telephone-fill"></i>
                                    </span>
                                </Button>
                                
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
                {/* /Conference Call Modal */}
            </span>;
            break;
        case 'DocCam':
            message = <span>
                {/* /Document Camera settings */}
                <div className="col d-flex flex-row flex-wrap justify-content-around text-center font-size-3 font-size-4-xl py-3">
                    <div className="col-6 p-0 mb-3 mb-xl-5">
                        <div className="form-switch p-0">
                            <input className="form-check-input border-0 m-0 mb-3 mediumSwitch" 
                            type="checkbox"
                            role="switch"
                            id='autoFocusSwitch'
                            checked={autoFocusSwitch}
                            onChange={toggleAutoFocusSwitch}
                            style={{backgroundColor:autoFocusSwitch ? 'var(--bs-info)' : 'var(--bs-gray-300'}}
                            />
                                <label className="d-block form-check-label font-size-2 font-size-4-xl"
                                    htmlFor="autoFocusSwitch"><i className="bi bi-camera"></i> Autofocus</label>
                        </div>
                    </div>
                    <div className="col-6 p-0 mb-3 mb-xl-5">
                        <div className="form-switch p-0">
                            <input className="form-check-input border-0 m-0 mb-3 mediumSwitch" 
                            type="checkbox"
                            role="switch"
                            id='lampSwitch'
                            checked={lampSwitch}
                            onChange={toggleLampSwitch}
                            style={{backgroundColor:lampSwitch ? 'var(--bs-info)' : 'var(--bs-gray-300)'}}
                            />
                                <label className="d-block form-check-label font-size-2 font-size-4-xl"
                                    htmlFor="lampSwitch"><i className="bi bi-lightbulb-fill"></i> Lamp</label>
                        </div>
                    </div>
                    {/* Zoom buttons */}
                    <div className="col-12 mb-2">
                        <div className="btn-group mb-1" role="group" aria-label="Zoom buttons">
                            <button type="button" className="btn btn-info border-0 rounded-start-pill text-white px-3 px-xl-4 py-1 font-size-2 font-size-4-xl" onClick={() => {
                            window.CrComLib.publishEvent('b', '83', true);
                            window.CrComLib.publishEvent('b', '83', false);
                            console.log('DocCam Zooming Out') 
                        }}><i className="bi bi-dash-circle-fill"></i></button>
                            <button type="button" className="btn bg-info border-0 rounded-end-pill text-white px-3 px-xl-4 py-1  font-size-2 font-size-4-xl" onClick={() => {
                            window.CrComLib.publishEvent('b', '84', true);
                            window.CrComLib.publishEvent('b', '84', false);
                            console.log('DocCam Zooming In') 
                        }}><i className="bi bi-plus-circle-fill"></i></button>
                        </div>
                        <label className="d-block font-size-2 font-size-4-xl"
                            for="Zoom buttons"><i className="bi bi-zoom-in"></i> Zoom</label>
                    </div>
                    {/* /Zoom buttons */}
                </div>
                {/* /Document Camera settings */}
            </span>;
            break;
        case 'BluRay':
            message = <div>
                <p>Your Blu-Ray content is being displayed.</p>
                <button className='btn btn-info rounded-pill border-0 px-3 mt-3 font-size-3 font-size-4-xl' onClick={handleShowBluRayModal}>
                    Blu-Ray Controls</button>
                
                {/* BluRay Modal */}
                <Modal show={bluRayClicked} onHide={handleCloseBluRayModal} fullscreen={fullscreen}>
                <Modal.Header closeButton className="pb-0">
                    <Modal.Title>
                        <h1 className="font-size-5 font-size-6-xl"><button type="button" className="border-0 text-dark"
                            onClick={handleCloseBluRayModal}><i className="bi bi-arrow-left"></i></button>Blu-Ray Controls</h1>
                    </Modal.Title>
                </Modal.Header>
                    <Modal.Body className="font-size-2 font-size-3-xl p-0">
                        <div className='container-fluid text-center'>
                            {/* Opad Control */}
                            <div className='col-3 mx-auto pt-2 mb-3 mb-xl-5'>
                                <Opad centerButton={true} upJoin='271' downJoin='273'
                                    leftJoin='274' rightJoin='272' centerJoin='275' />
                            </div>
                            {/* Media Buttons Row */}
                            <div className='d-flex flex-row mx-auto my-2 mb-2 mb-xl-5'>
                                <div className='position-relative bg-white rounded-circle mx-auto pt-2 shadow blurayControls'
                                    style={{ backgroundColor: (blurayButton === 'Eject') ? 'black' : '' }}
                                    onClick={() => { blurayControl('59', 'Eject') }}>
                                        <i className="d-inline-block position-absolute top-50 start-50 translate-middle bi bi-eject-fill font-size-5 font-size-5-xl mx-auto"></i>
                                </div>
                                <div className='position-relative bg-white rounded-circle  mx-auto shadow pt-2 blurayControls'
                                    onClick={() => blurayControl('57', 'Previous')}>
                                     <i className="d-inline-block position-absolute top-50 start-50 translate-middle bi bi-skip-backward-fill font-size-5 font-size-5-xl mx-auto"></i>
                                </div>
                                <div className='position-relative bg-white rounded-circle mx-auto shadow pt-2 blurayControls'
                                    onClick={() => blurayControl('67', 'Rewind')}>
                                    <i className="d-inline-block position-absolute top-50 start-50 translate-middle bi bi-rewind-fill font-size-5 font-size-5-xl mx-auto"></i>
                                </div>
                                <div className='position-relative bg-white rounded-circle mx-auto shadow pt-2 blurayControls'
                                    onClick={() => blurayControl('65', 'Pause')}>
                                    <i className="d-inline-block position-absolute top-50 start-50 translate-middle bi bi-pause-fill font-size-5 font-size-5-xl mx-auto"></i>
                                </div>
                                <div className='position-relative bg-white rounded-circle  mx-auto shadow pt-2 blurayControls'
                                    onClick={() => blurayControl('64', 'Play')}>
                                    <i className="d-inline-block position-absolute top-50 start-50 translate-middle bi bi-play-fill font-size-5 font-size-5-xl mx-auto"></i>
                                </div>
                                <div className='position-relative bg-white rounded-circle  mx-auto shadow pt-2 blurayControls'
                                    onClick={() => blurayControl('66', 'Stop')}>
                                    <i className="d-inline-block position-absolute top-50 start-50 translate-middle bi bi-stop-fill font-size-5 font-size-5-xl mx-auto"></i>
                                </div>
                                <div className='position-relative bg-white rounded-circle  mx-auto shadow pt-2 blurayControls'
                                    onClick={() => blurayControl('68', 'Fast Forward')}>
                                    <i className="d-inline-block position-absolute top-50 start-50 translate-middle bi bi-fast-forward-fill font-size-5 font-size-5-xl mx-auto"></i>
                                </div>
                                <div className='position-relative bg-white rounded-circle  mx-auto shadow pt-2 blurayControls'
                                    onClick={() => blurayControl('58', 'Next')}>
                                    <i className="d-inline-block position-absolute top-50 start-50 translate-middle bi bi-skip-forward-fill font-size-5 font-size-5-xl mx-auto"></i>
                                </div>
                            </div>
                            {/* /Media Buttons Row */}
                            {/* Menu Buttons Group */}
                            <div className='d-flex flex-row flex-wrap justify-content-center'>
                                <button className='btn btn-info col-4 rounded-pill border-0 my-3 mx-3 font-size-3 font-size-4-xl' onClick={() => blurayControl('60', 'Home')}>
                                    <i className="d-inline-block bi bi-house-fill me-1"></i>
                                    Home</button>
                                <button className='btn btn-info col-4 rounded-pill border-0 my-3 mx-3 font-size-3 font-size-4-xl' onClick={() => blurayControl('62', 'Menu')}>
                                    <i className="d-inline-block bi bi-list me-1"></i>
                                    Menu</button>
                                <button className='btn btn-info col-4 rounded-pill border-0 my-3 mx-3 font-size-3 font-size-4-xl' onClick={() => blurayControl('61', 'Info')}>
                                    <i className="d-inline-block bi bi-info-circle-fill me-1"></i>
                                    Info</button>
                                <button className='btn btn-info col-4 rounded-pill border-0 my-3 mx-3 font-size-3 font-size-4-xl' onClick={() => blurayControl('63', 'Return')}>
                                    <i className="d-inline-block bi bi-arrow-left me-1"></i>
                                    Return</button>
                            </div>
                            {/* /Menu Buttons Group */}
                        </div>
                    </Modal.Body>
            </Modal> 
            </div>;
            break;
        default:
            message = <p>Select a source to the {side} to present.</p>
    }
    return(
        <div className="col-12">
            <div className="row m-0">
                {(sourceSelected == '') ? 
                    <div className='col bg-dark text-white text-center font-size-3 font-size-4-xl p-2 p-xl-3 sourceStatus'>
                        <p>Display {displayNum} is off.</p>
                    </div> : 
                    <div className={`col text-center font-size-3 font-size-4-xl p-2 p-xl-3 sourceStatus ${(isMuted ? 'bg-warning' : 'bg-success')}`}>
                        <p>{isMuted ? `Display ${displayNum} is muted.` : `Display ${displayNum} is on.`}</p>
                    </div>}
            </div>

            <div className="row p-0 m-0">
                <div className="col text-center font-size-3 font-size-4-xl py-3 contentArea">
                {message}
                </div>
            </div>

            {/* Button Row */}
            <div className="row align-items-center m-0 text-center font-size-2 font-size-3-xl contentAreaButtonRow">
                {isMuted ?
                    <div className="col-6 p-0">
                        <button type="button"
                            className="d-flex align-items-center border-0 rounded-circle text-center text-white mx-auto mb-2 circleIcon"
                            style={{ backgroundColor: 'var(--bs-info)' }} data-bs-toggle="button" onClick={() => toggleMute(displayJoin)}>
                            <i
                                className="d-inline-block bi bi-camera-video-off font-size-4 font-size-5-xl mx-auto"></i>
                        </button>
                        <div className="font-size-2 font-size-3-xl">Unmute Display</div>
                    </div> :
                    <div className="col-6 p-0">
                        <button type="button"
                            className="d-flex align-items-center border-0 rounded-circle text-center text-dark mx-auto mb-2 circleIcon"
                            style={{ backgroundColor: '#D5D5D5' }} data-bs-toggle="button" onClick={() => toggleMute(displayJoin)}>
                            <i className="d-inline-block bi bi-camera-video-fill font-size-4 font-size-5-xl mx-auto"></i>
                        </button>
                        <div className="font-size-2 font-size-3-xl">Mute Display</div>
                    </div>}
                    <div className='col-6 p-0'>
                    {isClicked ? 
                          <button type="button"
                          className="d-flex align-items-center border-0 rounded-circle text-center text-dark mx-auto mb-2 circleIcon"
                          style={{ backgroundColor: 'var(--cyan)'}} data-bs-toggle="modal" data-bs-target="#displaySettingsModal">
                          <i className="d-inline-block bi bi-gear-fill font-size-4 font-size-5-xl mx-auto"></i>
                      </button> :
                        <button type="button"
                        className="d-flex align-items-center border-0 rounded-circle text-center text-dark mx-auto mb-2 circleIcon"
                        style={{ backgroundColor: '#D5D5D5'}} onClick={handleShowDisplayModal}>
                        <i className="d-inline-block bi bi-gear-fill font-size-4 font-size-5-xl mx-auto"></i>
                    </button>}
                    <div className='font-size-2 font-size-3-xl'>Display Settings</div> 
                </div>
            </div>

            {/* Display Settings Modal */}
            <Modal show={isClicked} fullscreen={fullscreen} onHide={handleCloseDisplayModal}>
                <Modal.Header closeButton className="pb-0">
                    <Modal.Title>
                        <h1 className="font-size-5 font-size-6-xl"><button type="button" className="border-0 text-dark"
                            onClick={handleCloseDisplayModal}><i className="bi bi-arrow-left"></i></button>Display Settings</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="font-size-2 font-size-3-xl p-0 pt-xl-3"> 
                <div className='container-fluid text-center'>
                        <h2 className='font-size-5 font-size-6-xl my-1 my-xl-2'>Display {displayNum}</h2>
                        {/* Power Button */}
                        <div className="row my-4 my-xl-5">
                            <div className="col text-center mx-auto">
                                <div className="form-switch p-0">
                                    <input
                                        className="form-check-input m-0 mb-4 border-0 largeSwitch"
                                        type="checkbox"
                                        role="switch"
                                        id="powerSwitch"
                                        checked={powerSwitch}
                                        onChange={togglePowerSwitch}
                                        style={{ backgroundColor: powerSwitch ? '#007FA4' : '#e9ecef' }}
                                    />
                                    <label className="d-block form-check-label font-size-3 font-size-4-xl"
                                        htmlfor="powerSwitch">Power</label>
                                </div>
                            </div>
                        </div>
                        {/* /Power Button */}
                        {/* Options */}
                        <div className="row justify-content-around mb-4 mb-xl-5">
                            <div className="col-4">
                                <button type="button"
                                    className={`d-flex align-items-center border-0 rounded-circle text-center mx-auto mb-2 circleIcon ${annotationPressed ? 'text-white' : 'text-dark'}`}
                                    style={{backgroundColor:annotationPressed ? 'var(--bs-info' : 'var(--bs-gray-300'}} onClick={handleAnnotationPressed}>
                                    <i className="d-inline-block bi bi-pencil-fill font-size-4 font-size-5-xl mx-auto"></i>
                                </button>
                                <div className="font-size-3 font-size-4-xl">Annotate</div>
                            </div>
                            <div className="col-4">
                                 <button type="button"
                                    className={`d-flex align-items-center border-0 rounded-circle text-center mx-auto mb-2 circleIcon ${fullscreenPressed ? 'text-white' : 'text-dark'}`}
                                    style={{backgroundColor:fullscreenPressed ? 'var(--bs-info' : 'var(--bs-gray-300'}} onClick={handleFullscreenPressed}>
                                    <i className="d-inline-block bi bi-arrows-fullscreen font-size-4 font-size-5-xl mx-auto"></i>
                                </button>
                                <div className="font-size-3 font-size-4-xl">Preview Fullscreen</div>
                            </div>
                            <div className="col-4">
                                <button type="button"
                                    className={`d-flex align-items-center border-0 rounded-circle text-center mx-auto mb-2 circleIcon ${isMuted ? 'text-white' : 'text-dark'}`}
                                    style={{backgroundColor:isMuted ? 'var(--bs-info' : 'var(--bs-gray-300'}} onClick={() => toggleMute(displayJoin)}>
                                    <i className={`d-inline-block bi ${isMuted ? 'bi-camera-video-off-fill' : 'bi-camera-video-fill'}  font-size-4 font-size-5-xl mx-auto`}></i>
                                </button>
                                <div className="font-size-3 font-size-4-xl">Mute Display</div>
                            </div>

                        </div>
                     {/* /Options */}
                     {/* Screen Position Buttons */}
                        <div className="row">
                            <div className="col text-center">
                                <div className="my-3 my-xl-5">
                                    {/* Down Button */}
                                    <button type="button"
                                        className="btn col-4 bg-info border-0 rounded-pill py-2 me-3 text-white fw-bold font-size-3" onClick={() => {
                                            window.CrComLib.publishEvent('b', `${downJoin}`, true);
                                            window.CrComLib.publishEvent('b', `${downJoin}`, false);
                                            console.log('Screen downed')
                                        }}><i
                                            className="d-inline-block bi bi-chevron-down font-size-4 font-size-5-xl mx-auto"></i></button>
                                    {/* Up Button */}
                                    <button type="button"
                                        className="btn col-4 bg-info border-0 rounded-pill py-2 text-white fw-bold font-size-3"><i
                                            className="d-inline-block bi bi-chevron-up font-size-4 font-size-5-xl mx-auto" onClick={() => {
                                                window.CrComLib.publishEvent('b', `${upJoin}`, true);
                                                window.CrComLib.publishEvent('b', `${upJoin}`, false);
                                                console.log('Screen upped')
                                            }}></i></button>
                                </div>
                                <span className="d-inline-block font-size-3 font-size-4-xl">Screen Position</span>
                            </div>
                        </div>
                        {/* /Screen Position Buttons */}
                    </div>
                </Modal.Body>
            </Modal> 
        </div>
    )
}

export default DisplayArea;
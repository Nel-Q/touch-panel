import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, InputGroup, FormControl, Modal } from 'react-bootstrap'; 

import PowerLogo from './Icons/power.svg';
import VolumeLogo from './Icons/volume-up-fill.svg';
import MicLogo from './Icons/mic-fill.svg';
import CameraLogo from './Icons/camera-video-fill.svg';
import CameraSmall from './Icons/camera-video-small.svg';
import CameraSmallWhite from './Icons/camera-video-white.svg';
import './BottomBar.css';
import CModal from './CModal';
import Opad from './Opad';
import VolumeControl from './VolumeControl';
import MicIcon from './Icons/mic-fill2.svg';
import MicMuteIcon from './Icons/mic-mute-fill.svg';
import MinusWhite from './Icons/dashWhite.svg';
import PlusWhite from './Icons/plusWhite.svg';
import Zoom from "./Icons/zoom-in.svg";


function BottomBar () {
  const [showPowerModal, setShowPowerModal] = useState(false);
  const [showVolumeModal, setShowVolumeModal] = useState(false);
  const [showMicModal, setShowMicModal] = useState(false);
  const [showCamModal, setShowCamModal] = useState(false);
  const [cameraSelected, setCameraSelected] = useState('');
  const [showControls, setShowControls] = useState(false)
  const [presentationVolume, setPresentationVolume] = useState(0);
  const [MicVolume, setMicVolume] = useState(0);
  const [isPresentationMuted, setIsPresentationMuted] = useState(false);
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isCeilingMicMuted, setIsCeilingMicMuted] = useState(false);
  const [numCameras, setNumCameras] = useState(2);
  const [numOfPresets, setNumOfPresets] = useState(6);
  const [presetRenameMode, setpresetRenameMode] = useState(false);
  const [presetNames, setPresetNames] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [newPresetName, setNewPresetName] = useState('');
  const [camNames, setCamNames] = useState([]);
  const [camRenameMode, setCamRenameMode] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [newCamName, setNewCamName] = useState('');
  const holdTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.CrComLib.subscribeState('n', '1', value=> setPresentationVolume(value));
    window.CrComLib.subscribeState('n', '2', value=> setMicVolume(value));
    // window.CrComLib.subscribeState('n', '41', value=> setNumCameras(value));
    // window.CrComLib.subscribeState('n', '46', value=> setNumOfPresets(value));
    setPresetNames(Array(6).fill('').map((_, index) => `Preset ${index + 1}`));
    setCamNames(Array(2).fill('').map((_, index) => `Camera ${index + 1}`));
    console.log(numCameras)
  }, [])

  const programShutOff = () => {
    handleClosePowerModal()
    navigate('/');
    window.CrComLib.publishEvent('b', '30', true);
    window.CrComLib.publishEvent('b', '30', false);
    
    console.log("program shut off")
}
  const handleShowPowerModal = () => {
    console.log("Showing Power Modal")
    setShowPowerModal(true);
    
  }
  const handleClosePowerModal = () => {
    setShowPowerModal(false);
  }

  const handleShowVolumeModal = () => {
    console.log("Showing Volume Modal")
    setShowVolumeModal(true);
    
  }
  const handleCloseVolumeModal = () => {
    setShowVolumeModal(false);
  }
  const handleShowMicModal = () => {
    console.log("Showing Volume Modal")
    setShowMicModal(true);
    
  }
  const handleCloseMicModal = () => {
    setShowMicModal(false);
  }
  const handleShowCamModal = () => {
    console.log("Showing Cam Modal")
    setShowCamModal(true);
    
  }
  const handleCloseCamModal = () => {
    console.log("Closing Cam Modal")
    setShowCamModal(false);
  }
  const togglePresentationMute = () => {
    setIsPresentationMuted((prevIsPresentationMuted) => !(prevIsPresentationMuted));
    if (isPresentationMuted) {
        window.CrComLib.publishEvent('b', '20', false);
        console.log('program unmuted')
    } else{
        window.CrComLib.publishEvent('b', '20', true);
        console.log('program muted')
    }
}
const handleCameraClicked = (cameraName, cameraNum) => {
  setCameraSelected(cameraName);
  setShowControls(true);
  window.CrComLib.publishEvent('n', '42', cameraNum);
  console.log(`${cameraName} clicked` )
}
const handlePresetClicked = (presetNum) => {
  window.CrComLib.publishEvent('n', '47', presetNum);
  console.log(`Preset ${presetNum} pressed`)
}
const toggleMicMute = () => {
  setIsMicMuted((prevIsMicMuted) => !(prevIsMicMuted));
  if (isMicMuted) {
      window.CrComLib.publishEvent('b', '23', false);
      console.log('program unmuted')
  } else{
      window.CrComLib.publishEvent('b', '23', true);
      console.log('program muted')
  }
}
const toggleCeilingMicMute = () => {
  setIsCeilingMicMuted((prevIsCeilingMicMuted) => !(prevIsCeilingMicMuted));
  if (isCeilingMicMuted) {
      window.CrComLib.publishEvent('b', '111', false);
      console.log('program unmuted')
  } else{
      window.CrComLib.publishEvent('b', '111', true);
      console.log('program muted')
  }
}
const sendSignal= (joinNumber, action) => {
  window.CrComLib.publishEvent('b', `${joinNumber}`, true);
  window.CrComLib.publishEvent('b', `${joinNumber}`, false);
  console.log(`${action} pressed`);
}
const handlePresetLongPress = (presetNumber) => {
  setSelectedPreset(presetNumber);
  setpresetRenameMode(true);
  window.CrComLib.publishEvent('n', '48', presetNumber);
  console.log(`Long press on preset ${presetNumber}`);
};

// Function to handle saving the new name for the preset
const handleSaveNewPresetName = () => {
  // Handle saving the new name for the preset
  const updatedPresetNames = [...presetNames];
  updatedPresetNames[selectedPreset - 1] = newPresetName;
  console.log(`New name for preset ${selectedPreset}: ${newPresetName}`);
  setPresetNames(updatedPresetNames);
  window.CrComLib.publishEvent('s', '40', newPresetName);
  window.CrComLib.publishEvent('b', '190', true);
  window.CrComLib.publishEvent('b', '190', false);
  setpresetRenameMode(false);
  setNewPresetName('');
};

// Function to handle cancelling the renaming process
const handleCancelPresetRename = () => {
  setpresetRenameMode(false);
  setNewPresetName('');
};

// Function to handle changes in the new preset name input field
const handleNewPresetNameChange = (event) => {
  setNewPresetName(event.target.value);
};
const handleCamLongPress = (camNumber) => {
  setSelectedCamera(camNumber);
  setCamRenameMode(true);
  window.CrComLib.publishEvent('n', '43', camNumber);
  console.log(`Long press on Camera ${camNumber}`);
};

// Function to handle saving the new name for the preset
const handleSaveNewCamName = () => {
  // Handle saving the new name for the preset
  const updatedCamNames = [...camNames];
  updatedCamNames[selectedCamera - 1] = newCamName;
  console.log(`New name for camera${selectedCamera}: ${newCamName}`);
  setCamNames(updatedCamNames);
  window.CrComLib.publishEvent('s', '40', newCamName);
  window.CrComLib.publishEvent('b', '190', true);
  window.CrComLib.publishEvent('b', '190', false);
  setCamRenameMode(false);
  setNewCamName('');
};

// Function to handle cancelling the renaming process
const handleCancelCamRename = () => {
  setCamRenameMode(false);
  setNewCamName('');
};

// Function to handle changes in the new preset name input field
const handleNewCamNameChange = (event) => {
  setNewCamName(event.target.value);
};
let camNum;
switch (cameraSelected) {
  case 'Camera1':
      camNum = "One"
      break;
  case 'Camera2':
      camNum = "Two"
      break;
} 
  
  return (
    <div className="BottomBar bg-secondary d-flex flex-row justify-content-center w-100 ">
        <div className="col border border-1 border-top-0 border-bottom-0 border-dark py-1 "
            onClick={handleShowPowerModal}>
            <h5 className='h7'>System Off</h5>
            <img
              src={PowerLogo}
              alt='Power icon'
              size={32}
              className='icon'/>
        </div>
        <div className=''>
            <CModal show={showPowerModal} onHide={handleClosePowerModal} title='System Off?'>
                <div className='col-10 align-items-center ml-5 mt -5 pl-5 pt-5'>
                  <h5>Are you sure you want to shut down the system?</h5>
                  <div className='d-flex col-10 pt-5 pl-6 ml-5 justify-content-between'>
                    <div className='btn btn-gray-600 rounded-pill px-5 cancelButton text-white ' onClick={handleClosePowerModal}>
                      <h6 className='px-3'> Cancel</h6>
                    </div>
                    <Button className='btn btn-info rounded-pill px-5' onClick={programShutOff}>
                      <h6 className='px-5'>Yes</h6>
                    </Button>
                </div>
                </div>
                
            </CModal>
        </div>
        <div className={`col border border-1 border-top-0 border-bottom-0 border-dark ${showVolumeModal ? 'bg-primary' : ''}`}
          onClick={handleShowVolumeModal}>
            <h5 className='h7 '>Presentation Volume</h5>
            <img
              src={VolumeLogo}
              alt='Volume fill icon'
              className='img-fluid'/>
        </div>
        <CModal show={showVolumeModal} onHide={handleCloseVolumeModal} title='Presentation Volume'>
          <div className='col-10 align-items-center mx-auto pl-5 pt-4 mt-4'>
            <VolumeControl initialVolume={presentationVolume} plusJoin='22' minusJoin='21' isMuted={isPresentationMuted}/>
            <div onClick={togglePresentationMute} className='col-4 mx-auto pl-5'>
              <div className={`rounded-circle muteIcon   ${isPresentationMuted ? 'bg-info' : ''}`}
                style={{backgroundColor: '#e9ecef', width:'90px', height:'90px'}}>
                <img 
                  src={isPresentationMuted ? MicMuteIcon : MicIcon}
                  alt={isPresentationMuted ? 'Microphone Mute icon' : 'Microphone Icon' }
                  className='img-fluid mt-3'/>
              </div>
              <h5 className={`row ${isPresentationMuted ? '' : 'ml-1'}`}>{isPresentationMuted ? 'Unmute' : 'Mute'}</h5>
            </div>
          </div>
          <div className='bg-secondary row mx-auto col-8 mt-5  '>
            <h5 className='col-md-1 bg-info mt-5 mb-5 rounded-circle text-white'><em>i</em></h5>
            <h5 className='col mb-0'>Sound not playing? Be sure to select the correct audio on your device.</h5>
          </div>
              
        </CModal>

        <div className={`col border border-1 border-top-0 border-bottom-0 border-dark ${showMicModal ? 'bg-primary' : ''}`}
          onClick={handleShowMicModal}>
            <h5 className='h7 '>Microphones</h5>
            <img
              src={MicLogo}
              alt='Microphone icon'
              className='img-fluid'/>
        </div>
        <CModal show={showMicModal} onHide={handleCloseMicModal} title='Microphones'>
          <div className='col-10 align-items-center ml-5 mt-2 pl-5 '>
            <h5 className='col-3 mb-3'>Microphones</h5>
            <VolumeControl initialVolume={MicVolume} plusJoin='25' minusJoin='24' isMuted={isMicMuted}/>
            <div onClick={toggleMicMute} className='col-4 mx-auto pl-5'>
              <div className={`rounded-circle muteIcon   ${isMicMuted ? 'bg-info' : ''}`}
                style={{backgroundColor: '#e9ecef', width:'90px', height:'90px'}}>
                <img 
                  src={isMicMuted ? MicMuteIcon : MicIcon}
                  alt={isMicMuted ? 'Microphone Mute icon' : 'Microphone Icon' }
                  className='img-fluid mt-3'/>
              </div>
              <h5 className={`row ${isMicMuted ? '' : 'ml-1'}`}>{isMicMuted ? 'Unmute' : 'Mute'}</h5>
            </div>
            <div>
              <h5 className='col-4'>Ceiling Mics</h5>
              <div onClick={toggleCeilingMicMute} className='col-4 mx-auto pl-5'>
                <div className={`rounded-circle muteIcon   ${isCeilingMicMuted ? 'bg-info' : ''}`}
                  style={{backgroundColor: '#e9ecef', width:'90px', height:'90px'}}>
                  <img 
                    src={isCeilingMicMuted ? MicMuteIcon : MicIcon}
                    alt={isCeilingMicMuted ? 'Microphone Mute icon' : 'Microphone Icon' }
                    className='img-fluid mt-3'/>
                </div>
                <h5 className={`row ${isCeilingMicMuted ? '' : 'ml-1'}`}>{isCeilingMicMuted ? 'Unmute' : 'Mute'}</h5>
              </div>
              
            </div>
          </div>
              
        </CModal>

        <div className={`col border border-1 border-top-0 border-bottom-0 border-dark ${showCamModal ? 'bg-primary' : ''}`}
          onClick={handleShowCamModal}>
            <h5 className='h7'>Camera Controls</h5>
            <img
              src={CameraLogo}
              alt='Camera icon'
              className='img-fluid'/>
        </div>
        <CModal show={showCamModal} onHide={handleCloseCamModal} title="Camera Controls">
          <h5>Select Camera:</h5>
          <div className='d-flex flex-row justify-content-between mx-auto py-4'>
            {Array.from({length:2}, (_, index) => {
              const camNumber = index + 1
              const camName = `Camera${index + 1}`;
              return(
                <div key={camName} 
                className={`col-4 rounded-pill mx-auto d-flex flex-row justify-content-center py-2`}
                style={{backgroundColor:(cameraSelected === camName) ? "#007FA4" : "#dee2e6"}}
                onClick={() => handleCameraClicked(camName, index +1)}
                onMouseDown={() => {
                  holdTimeoutRef.current = setTimeout(() => handleCamLongPress(camNumber), 500);
                }}
                onMouseUp={() => clearTimeout(holdTimeoutRef.current)}
                onTouchStart={() => {
                  holdTimeoutRef.current = setTimeout(() => handleCamLongPress(camNumber), 500);
                }}
                onTouchEnd={() => clearTimeout(holdTimeoutRef.current)}
                onMouseLeave={() => clearTimeout(holdTimeoutRef.current)}>
                <img 
                  src={(cameraSelected === camName) ? CameraSmallWhite : CameraSmall}
                  alt='Camera Icon'
                  className=' img-fluid pr-2'/>
                  <h5 className={`h6 ${(cameraSelected === camName) ? 'text-white' : ''}`}>{camNames[camNumber - 1]}</h5>
                </div>)
            })}
            
          </div>
          <Modal show={camRenameMode} onHide={handleCancelCamRename} dialogClassName='rename-modal vh-40'>
            <Modal.Header closeButton>
              <Modal.Title>Camera Rename</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <InputGroup className="mb-3">
                <FormControl
                  placeholder="Enter new camera name"
                  value={newCamName}
                  onChange={handleNewCamNameChange}
                />
              </InputGroup>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCancelCamRename}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveNewCamName}>
                Save
              </Button>
            </Modal.Footer>
          </Modal>

          {showControls && (
            <div className='pt-4'>
              <h5 className='pb-3'>Camera {camNum}</h5>
              <div className='d-flex flex-row justify-content-between'>
                <div className='pt-4 pl-4'>
                  <Opad upJoin='241' downJoin='242' leftJoin='243' rightJoin='244'/>
                </div>
                <div className='d-flex flex-column pt-5 ml-5'>
                    <div className='d-flex flex-row ml-3'>
                      <img 
                      
                        src={Zoom}
                        alt='Zoom-in Icon'
                        className='img-fluid pr-2'/>
                      <h6>Zoom</h6>
                    </div>
                    <div className='d-flex bg-info rounded-pill justify-content-between px-2'
                    style={{width:'140px'}}>
                      <div onClick={() => sendSignal('74', 'Zoom Out')}>
                          <img 
                              src={MinusWhite}
                              alt='Minus Icon'
                              className='img-fluid'/>
                      </div>
                      <div onClick={() => sendSignal('75', 'Zoom In')}>
                          <img 
                              src={PlusWhite}
                              alt='Plus Icon'
                              className='img-fluid'/>
                      </div>
                    </div>
                </div>
                <div className='d-flex flex-column pl-0 pr-3'>
                  {/* {[...Array(6)].map((_, index) => {
                    const presetNumber = index + 1;
                    return (
                      <Button
                        key={presetNumber}
                        className='btn btn-info rounded-pill mr-4'
                        onClick={() => handlePresetClicked(presetNumber)}
                      >
                        Preset {presetNumber}
                      </Button>
                    )
                  })} */}
                  {Array.from({ length: Math.ceil(numOfPresets / 2) }).map((_, rowIndex) => (
                    <Row key={rowIndex} className="justify-content-center mb-2" style={{height: '4rem'}}>
                      {Array.from({ length: 2 }, (_, colIndex) => {
                        const presetNumber = rowIndex * 2 + colIndex + 1;
                        return (
                          presetNumber <= numOfPresets && (
                            <Col key={presetNumber}  className="" style={{width: '12rem'}}>
                              <Button
                                className='btn btn-info rounded-pill mr-4'
                                style={{height: '3.5rem', fontSize: '1.5rem'}}
                                onClick={() => handlePresetClicked(presetNumber)}
                                onMouseDown={() => {
                                  holdTimeoutRef.current = setTimeout(() => handlePresetLongPress(presetNumber), 500);
                                }}
                                onMouseUp={() => clearTimeout(holdTimeoutRef.current)}
                                onMouseLeave={() => clearTimeout(holdTimeoutRef.current)}
                                onTouchStart={() => {
                                  holdTimeoutRef.current = setTimeout(() => handlePresetLongPress(presetNumber), 500);
                                }}
                                onTouchEnd={() => clearTimeout(holdTimeoutRef.current)}
                              >
                                {presetNames[presetNumber - 1]}
                              </Button>
                            </Col>
                          )
                        );
                      })}
                    </Row>
                  ))}
                  
                </div>
                {/* {presetRenameMode && (
                  <div>
                    <InputGroup className="mb-3">
                      <FormControl
                        placeholder="Enter new preset name"
                        value={newPresetName}
                        onChange={handleNewPresetNameChange}
                      />
                     
                        <Button variant="outline-secondary" onClick={handleSaveNewPresetName}>Save</Button>
                        <Button variant="outline-secondary" onClick={handleCancelPresetRename}>Cancel</Button>
                      
                    </InputGroup>
                  </div>
      )} */}
      <Modal show={presetRenameMode} onHide={handleCancelPresetRename} dialogClassName='rename-modal vh-40'>
        <Modal.Header closeButton>
          <Modal.Title>Preset Rename</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Enter new preset name"
              value={newPresetName}
              onChange={handleNewPresetNameChange}
            />
          </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelPresetRename}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveNewPresetName}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
              </div>
            </div>
          )}
        </CModal>
        <div className="col border border-1 border-top-0 border-bottom-0 border-right-0 border-dark">
          <div className=' d-flex flex-row justify-content-between'>
            <h5 className='h8 mb-0 ml-0'>Presentation Audio</h5>
            <div className={`d-flex flex-column pt-1 ${isPresentationMuted ? 'pl-1' : ''}`}>
              <div className={`rounded-circle  ${isPresentationMuted ? 'bg-warning ml-4' : 'bg-success ml-2'}`}
                style={{width:'10px', height: '10px'}}></div>
              <h6 className={`h9 ${isPresentationMuted ? '' : 'pl-1'}`}>{isPresentationMuted ? "Muted" : 'On'}</h6>
            </div>
          </div>
          <div className='d-flex flex-row justify-content-between'>
            <h5 className='h8 mb-0 ml-0'>Microphones</h5>
            <div className={`d-flex flex-column pt-1 ${isMicMuted ? 'pl-0' : ''}`}>
              <div className={`rounded-circle  ${isMicMuted ? 'bg-warning ml-4' : 'bg-success ml-2'}`}
                style={{width:'10px', height: '10px'}}></div>
              <h6 className={`h9 ${isMicMuted? '' : 'pl-1'}`}>{isMicMuted ? "Muted" : 'On'}</h6>
            </div>
          </div>
          <div className='d-flex flex-row justify-content-between '>
            <h5 className='h8 mb-0 ml-0'>Ceiling Mics</h5>
            <div className={`d-flex flex-column pt-1 ${isCeilingMicMuted ? 'pl-3' : ''}`}>
              <div className={`rounded-circle  ${isCeilingMicMuted  ? 'bg-warning ml-4 ' : 'bg-success ml-2'}`}
                style={{width:'10px', height: '10px'}}></div>
              <h6 className={`h9 ${isCeilingMicMuted  ? '' : 'pl-1'}`}>{isCeilingMicMuted  ? "Muted" : 'On'}</h6>
            </div>
          </div>
            
        </div>
     
      
      
    </div>
  );
};

export default BottomBar;

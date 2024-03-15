import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, InputGroup, FormControl, Modal } from 'react-bootstrap'; 
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
  const [numCameras, setNumCameras] = useState(0);
  const [numOfPresets, setNumOfPresets] = useState(0);
  const [presetRenameMode, setpresetRenameMode] = useState(false);
  const [presetNames, setPresetNames] = useState([]);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [newPresetName, setNewPresetName] = useState('');
  const [camNames, setCamNames] = useState([]);
  const [tempCamName, setTempCamName] = useState('');
  const [tempPresetName, setTempPresetName] = useState('');
  const [camRenameMode, setCamRenameMode] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [newCamName, setNewCamName] = useState('');
  const holdTimeoutRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.CrComLib.subscribeState('n', '1', value=> setPresentationVolume(value));
    window.CrComLib.subscribeState('n', '2', value=> setMicVolume(value));
    window.CrComLib.subscribeState('n', '41', value=> setNumCameras(value));
    window.CrComLib.subscribeState('n', '46', value=> setNumOfPresets(value));

    setPresetNames(Array(numOfPresets).fill('').map((_, index) =>{
      let value;
      window.CrComLib.subscribeState('s', `${index + 101}`, incomingValue => {
        value = incomingValue;
        console.log(`value is: ${value}`)
        setTempPresetName(value)
        console.log(`temp preset name is ${tempPresetName}`);
      });
      return value;
    }));
    
    setCamNames(Array(numCameras).fill('').map((_, index) =>
    {
      let value;
      window.CrComLib.subscribeState('s', `${index + 91}`, incomingValue => {
        value = incomingValue;
        console.log(`value is: ${value}`)
        setTempCamName(value)
        console.log(`temp Cam name is ${tempCamName}`);
      });
      return value;
    }));
    console.log(`number of cameras is ${numCameras}`);
    console.log(`number of presets is ${numOfPresets}`);
    console.log(`cameras array is ${camNames}`);
    console.log(`presets array is ${presetNames}`);
    
  }, [numCameras, numOfPresets, tempCamName, tempPresetName])

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
    console.log("Showing Microphones Volume Modal")
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
const handleCameraClicked = (cameraNum) => {
  setCameraSelected(cameraNum);
  setShowControls(true);
  window.CrComLib.publishEvent('n', '42', cameraNum);
  console.log(`${camNames[cameraNum - 1]}clicked` )
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
  
  return (

    <div className="row w-100 position-absolute bottom-0 p-0 m-0 footerRow">
      <div className="col-12 d-flex flex-row align-items-center text-dark p-0 m-0" style={{ backgroundColor: 'var(--secondary)' }}>
        <button type="button"
          className="col h-100 border-0 border-end border-dark text-center font-size-2 font-size-3-xl" onClick={handleShowPowerModal}>
          <i className="d-block bi bi-power mb-1 mb-xl-3 font-size-4 font-size-5-xl"></i>
          <span className="d-block">System Off</span>
        </button>
        <button type="button"
          className="col h-100 border-0 border-end border-dark text-center font-size-2 font-size-3-xl" onClick={handleShowVolumeModal}>
          <i className="d-block bi bi-volume-up-fill mb-1 mb-xl-3 font-size-4 font-size-5-xl"></i>
          <span className="d-block">Presentation Volume</span>
        </button>
        <button type="button"
          className="col h-100 border-0 border-end border-dark text-center font-size-2 font-size-3-xl" onClick={handleShowMicModal}>
          <i className="d-block bi bi-mic-fill mb-1 mb-xl-3 font-size-4 font-size-5-xl"></i>
          <span className="d-block">Microphones</span>
        </button>
        <button type="button"
          className="col h-100 border-0 border-end border-dark text-center font-size-2 font-size-3-xl" onClick={handleShowCamModal}>
          <i className="d-block bi bi-camera-video-fill mb-1 mb-xl-3 font-size-4 font-size-5-xl"></i>
          <span className="d-block">Camera Controls</span>
        </button>
        {/* Audio Statuses */}
        <div className="col h-100 border-end border-dark pt-1 pt-xl-4 px-1">
          <div className="d-flex justify-content-between mb-xl-1">
            <div className="col-9 font-size-0 font-size-1-xl m-0 p-0">Presentation Audio</div>
            <div className="col-1 font-size-1-xl">
              <div
                className={`border-0 rounded-circle mx-auto mb-0 mb-xl-1  ${isPresentationMuted ? 'bg-warning' : 'bg-success'}`} style={{ width: '13px', height: '13px' }}>
              </div>
              <div className={`font-size-0 font-size-1-xl ${isPresentationMuted ? '' : ''}`}>{isPresentationMuted ? "Muted" : 'On'}</div>
            </div>
          </div>
          <div className="d-flex justify-content-between mb-xl-1">
            <div class="col-6 font-size-0 font-size-1-xl p-0 m-0">
              Microphones
            </div>
            <div className="col-1 font-size-1-xl">
              <div
                className={`border-0 rounded-circle mx-auto mb-0 mb-xl-1  ${isMicMuted ? 'bg-warning' : 'bg-success'}`} style={{ width: '13px', height: '13px' }}>
              </div>
              <div className={`font-size-0 font-size-1-xl ${isMicMuted ? '' : ''}`}>{isMicMuted ? "Muted" : 'On'}</div>
            </div>
          </div>
          <div className="d-flex justify-content-between mb-xl-1">
            <div className="col-6 font-size-0 font-size-1-xl p-0 m-0">
              Ceiling Mics
            </div>
            <div className="col-1 font-size-1-xl">
              <div
                className={`border-0 rounded-circle mx-auto mb-0 mb-xl-1  ${isCeilingMicMuted ? 'bg-warning' : 'bg-success'}`} style={{ width: '13px', height: '13px' }}>
              </div>
              <div className={`font-size-0 font-size-1-xl ${isPresentationMuted ? '' : ''}`}>{isCeilingMicMuted ? "Muted" : 'On'}</div>
            </div>
          </div>
        </div>
        {/* /Audio Statuses */}
      </div>
      {/* /Row */}

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

        <CModal show={showVolumeModal} onHide={handleCloseVolumeModal} title='Presentation Volume'>
          <div className='col-10 align-items-center mx-auto pl-5 pt-4 mt-4'>
            <VolumeControl initialVolume={presentationVolume} plusJoin='22' minusJoin='21' isMuted={isPresentationMuted} volumeJoin='1'/>
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

        <CModal show={showCamModal} onHide={handleCloseCamModal} title="Camera Controls">
          <h5>Select Camera:</h5>
          <div className='col-12 d-flex flex-row justify-content-between mx-auto py-4'>
          {Array.from({length:numCameras}, (_, index) => {
              const camNumber = index + 1
              return(
                <div key={camNumber} 
                className={`col-4 rounded-pill d-flex flex-row justify-content-center py-2 mr-2`}
                style={{backgroundColor:(cameraSelected === camNumber) ? "#007FA4" : "#dee2e6"}}
                onClick={() => handleCameraClicked(index +1)}
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
                  src={(cameraSelected === camNumber) ? CameraSmallWhite : CameraSmall}
                  alt='Camera Icon'
                  className=' img-fluid pr-2'/>
                  <h5 className={`h6 ${(cameraSelected === camNumber) ? 'text-white' : ''}`}>{camNames[camNumber - 1]}</h5>
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
              <h5 className='pb-3'>{camNames[cameraSelected- 1]}</h5>
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
                  {Array.from({ length: Math.ceil(numOfPresets / 2) }).map((_, rowIndex) => (
                      <Row key={rowIndex} className="justify-content-center mb-2" style={{height: '4rem'}}>
                        {Array.from({ length: 2 }, (_, colIndex) => {
                          const presetNumber = rowIndex * 2 + colIndex + 1;
                          return (
                            presetNumber <= numOfPresets && (
                              <Col key={presetNumber}  className="" style={{width: '12rem'}}>
                                <Button
                                  className='btn btn-info rounded-pill mr-4 border-0'
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
    </div>
  );
};

export default BottomBar;

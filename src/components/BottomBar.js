import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Row, Col, InputGroup, FormControl, Modal } from 'react-bootstrap'; 
import './BottomBar.css';
import CModal from './CModal';
import Opad from './Opad';
import VolumeControl from './VolumeControl';


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
  const [fullscreen, setFullscreen] = useState(true);

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
      <div className="col-12 d-flex flex-row align-items-center text-dark p-0 m-0" style={{ backgroundColor: 'var(--bs-secondary)' }}>
        <button type="button"
          className="col h-100 bg-secondary border-0 border-end border-dark text-center font-size-2 font-size-3-xl" onClick={handleShowPowerModal}>
          <i className="d-block bi bi-power mb-1 mb-xl-3 font-size-4 font-size-5-xl"></i>
          <span className="d-block">System Off</span>
        </button>
        <button type="button"
          className="col h-100 bg-secondary border-0 border-end border-dark text-center font-size-2 font-size-3-xl" onClick={handleShowVolumeModal}>
          <i className="d-block bi bi-volume-up-fill mb-1 mb-xl-3 font-size-4 font-size-5-xl"></i>
          <span className="d-block">Presentation Volume</span>
        </button>
        <button type="button"
          className="col h-100 bg-secondary border-0 border-end border-dark text-center font-size-2 font-size-3-xl" onClick={handleShowMicModal}>
          <i className="d-block bi bi-mic-fill mb-1 mb-xl-3 font-size-4 font-size-5-xl"></i>
          <span className="d-block">Microphones</span>
        </button>
        <button type="button"
          className="col h-100 bg-secondary border-0 border-end border-dark text-center font-size-2 font-size-3-xl" onClick={handleShowCamModal}>
          <i className="d-block bi bi-camera-video-fill mb-1 mb-xl-3 font-size-4 font-size-5-xl"></i>
          <span className="d-block">Camera Controls</span>
        </button>
        {/* Audio Statuses */}
        <div className="col h-100 border-0 py-1 pt-xl-2 px-1">
          <div className="d-flex justify-content-start mb-0">
            <div className="col-9 font-size-0 font-size-2-xl m-0 p-0">Presentation Audio</div>
            <div className="col-3 text-center">
              <div
                className={`border-0 rounded-circle mx-auto mb-0 mb-xl-1  ${isPresentationMuted ? 'bg-warning' : 'bg-success'}`} style={{ width: '13px', height: '13px' }}>
              </div>
              <div className={`font-size-0 font-size-2-xl ${isPresentationMuted ? '' : ''}`}>{isPresentationMuted ? "Muted" : 'On'}</div>
            </div>
          </div>
          <div className="d-flex justify-content-start mb-0">
            <div class="col-9 font-size-0 font-size-2-xl p-0 m-0">
              Microphones
            </div>
            <div className="col-3 text-center">
              <div
                className={`border-0 rounded-circle mx-auto mb-0 mb-xl-1  ${isMicMuted ? 'bg-warning' : 'bg-success'}`} style={{ width: '13px', height: '13px' }}>
              </div>
              <div className={`font-size-0 font-size-2-xl ${isMicMuted ? '' : ''}`}>{isMicMuted ? "Muted" : 'On'}</div>
            </div>
          </div>
          <div className="d-flex justify-content-start mb-0">
            <div className="col-9 font-size-0 font-size-2-xl p-0 m-0">
              Ceiling Mics
            </div>
            <div className="col-3 text-center">
              <div
                className={`border-0 rounded-circle mx-auto mb-0 mb-xl-1  ${isCeilingMicMuted ? 'bg-warning' : 'bg-success'}`} style={{ width: '13px', height: '13px' }}>
              </div>
              <div className={`font-size-0 font-size-2-xl ${isPresentationMuted ? '' : ''}`}>{isCeilingMicMuted ? "Muted" : 'On'}</div>
            </div>
          </div>
        </div>
        {/* /Audio Statuses */}
      </div>
      {/* /Row */}

        <div>
        {/* System Off Modal */}
        <Modal show={showPowerModal} onHide={handleClosePowerModal} fullscreen={fullscreen}>
          <Modal.Header closeButton className="pb-0">
            <Modal.Title>
              <h1 className="font-size-5 font-size-6-xl"><button type="button" className="border-0 text-dark"
                onClick={handleClosePowerModal}><i class="bi bi-arrow-left"></i></button>System Off?</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="font-size-4 font-size-5-xl p-0">
            <div className='container-fluid text-center p-5'>
              <div className="mb-xl-5">Are you sure you want to shut down the system?</div>
              <div className='d-flex justify-content-center mt-5'>
                <button className='btn btn-gray-600 col-4 rounded-pill px-5 cancelButton text-white mx-3' onClick={handleClosePowerModal}>
                  Cancel
                </button>
                <button className='btn btn-info col-4 rounded-pill px-5 mx-3' onClick={programShutOff}>
                  Yes
                </button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
        </div>

        {/* Presentation Volume Modal */}
      <Modal show={showVolumeModal} onHide={handleCloseVolumeModal} fullscreen={fullscreen}>
        <Modal.Header closeButton className="pb-0">
          <Modal.Title>
            <h1 className="font-size-5 font-size-6-xl"><button type="button" className="border-0 text-dark"
              onClick={handleCloseVolumeModal}><i class="bi bi-arrow-left"></i></button>Presentation Volume</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="font-size-4 font-size-3-xl p-0">
          <div className='container-fluid text-center pt-3'>
            <div className="my-2 my-xl-5">
            <VolumeControl classNam="mx-auto" initialVolume={presentationVolume} plusJoin='22' minusJoin='21' isMuted={isPresentationMuted} volumeJoin='1' />
            </div>
            <div class="col-12 text-center mb-4">
              <button type="button"
                className={`d-flex align-items-center border-0 rounded-circle text-center text-dark mx-auto mb-3 mb-xl-4 muteIcon ${isPresentationMuted ? 'bg-info' : ''}`}
                style={{ backgroundColor: '#D5D5D5'}}
                onClick={togglePresentationMute}>
                <i
                className={`d-inline-block bi font-size-5 font-size-5-xl mx-auto ${isPresentationMuted ? 'bi-mic-mute-fill text-white' : 'bi-mic-fill'}`}
                ></i>
              </button>
              <div className='font-size-3 font-size-4-xl'>{isPresentationMuted ? 'Unmute' : 'Mute'}</div>
            </div>

            <div className="row">
              <div className="col-8 d-flex justify-content-start bg-secondary py-3 px-5 mx-auto">
                <div className="col-1">
                  <i
                    className={`d-block bi bi-info-circle-fill text-info font-size-4 font-size-5-xl`}
                  ></i>
                </div>
                <div className="col-11 font-size-3 font-size-4-xl">
                  Sound not playing? Be sure to select the correct audio on your device.
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Microphone Modal */}
      <Modal show={showMicModal} onHide={handleCloseMicModal} fullscreen={fullscreen}>
        <Modal.Header closeButton className="pb-0">
          <Modal.Title>
            <h1 className="font-size-5 font-size-6-xl"><button type="button" className="border-0 text-dark"
              onClick={handleCloseMicModal}><i class="bi bi-arrow-left"></i></button>Microphones</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="font-size-4 font-size-3-xl p-0">
          <div className='container-fluid text-center pt-1'>
            <div className="my-3 my-xl-5 mt-4">
              <VolumeControl initialVolume={MicVolume} plusJoin='25' minusJoin='24' isMuted={isMicMuted} />
            </div>
            <div className="col-12 text-center mb-3 mb-xl-5">
              <button type="button"
                className={`d-flex align-items-center border-0 rounded-circle text-center text-dark mx-auto mb-3 mb-xl-4 muteIcon ${isMicMuted ? 'bg-info' : ''}`}
                style={{ backgroundColor: '#D5D5D5' }}
                onClick={toggleMicMute}>
                <i
                  className={`d-inline-block bi font-size-5 font-size-5-xl mx-auto ${isMicMuted ? 'bi-mic-mute-fill text-white' : 'bi-mic-fill'}`}
                ></i>
              </button>
              <div className='font-size-3 font-size-4-xl'>{isMicMuted ? 'Unmute Microphones' : 'Mute Microphones'}</div>
            </div>
            <div className="col-12 text-center">
              <button type="button"
                className={`d-flex align-items-center border-0 rounded-circle text-center text-dark mx-auto mb-3 mb-xl-4 muteIcon ${isCeilingMicMuted ? 'bg-info' : ''}`}
                style={{ backgroundColor: '#D5D5D5' }}
                onClick={toggleCeilingMicMute}>
                <i
                  className={`d-inline-block bi font-size-5 font-size-5-xl mx-auto ${isCeilingMicMuted ? 'bi-mic-mute-fill text-white' : 'bi-mic-fill'}`}
                ></i>
              </button>
              <div className='font-size-3 font-size-4-xl'>{isCeilingMicMuted ? 'Unmute Ceiling Mics' : 'Mute Ceiling Mics'}</div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

        {/* Nelson's Modal */}
        <CModal show={showCamModal} onHide={handleCloseCamModal} title="Camera Controls">
        <h2 className="text-center mb-4 font-size-4 font-size-5-xl">Select Camera</h2>
        <div className='row'>
          <div className="col-12 d-flex flex-wrap justify-content-around">
            {Array.from({ length: numCameras }, (_, index) => {
              const camNumber = index + 1
              return (
                <button key={camNumber}
                  className={`btn col-3 rounded-pill border-0 px-2 mx-2 mb-4 mb-xl-5 font-size-3 font-size-4-xl ${(cameraSelected === camNumber) ? 'btn-info' : 'bg-gray-300'}`}
                  onClick={() => handleCameraClicked(index + 1)}
                  onMouseDown={() => {
                    holdTimeoutRef.current = setTimeout(() => handleCamLongPress(camNumber), 500);
                  }}
                  onMouseUp={() => clearTimeout(holdTimeoutRef.current)}
                  onTouchStart={() => {
                    holdTimeoutRef.current = setTimeout(() => handleCamLongPress(camNumber), 500);
                  }}
                  onTouchEnd={() => clearTimeout(holdTimeoutRef.current)}
                  onMouseLeave={() => clearTimeout(holdTimeoutRef.current)}>
                  <i className="bi bi-camera-video-fill me-2"></i>
                  {camNames[camNumber - 1]}
                </button>)
            })}
          </div>
        </div>

          {/* Camera Rename Modal */}
          <Modal show={camRenameMode} onHide={handleCancelCamRename} fullscreen={fullscreen}>
            <Modal.Header closeButton>
              <Modal.Title>
              <h1 className="font-size-5 font-size-6-xl"><button type="button" className="border-0 text-dark"
              onClick={handleCancelCamRename}><i class="bi bi-arrow-left"></i></button>Rename Camera</h1>
                </Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <div className="col-8 pt-5 mx-auto">
              <input
                className="form-control"
                placeholder="Enter a new camera name"
                value={newCamName}
                onChange={handleNewCamNameChange} />
            </div>
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
          {/* /Camera Rename Modal */}

          {showControls && (
            <div>
              <div>
              {/* Camera Controls Row */}
              <div className="row align-items-center">
                <h2 className="text-center mb-4 mb-xl-4 font-size-4 font-size-5-xl">{camNames[cameraSelected - 1]}</h2>
                <div className="col-3">
                <Opad upJoin='241' downJoin='242' leftJoin='243' rightJoin='244'/>
                </div>
                <div className="col-2 text-center">
                  <label className="d-block mb-2 font-size-3 font-size-4-xl"
                    for="Zoom buttons"><i className="bi bi-zoom-in"></i> Zoom</label>
                  <div className="btn-group mb-1" role="group" aria-label="Zoom buttons">
                    <button type="button" className="btn btn-info border-0 rounded-start-pill p-3 px-4 ps-xl-5 text-white font-size-2 font-size-4-xl" onClick={() => sendSignal('74', 'Zoom Out')}>
                      <i className="bi bi-dash-circle-fill"></i>
                    </button>
                    <button type="button" className="btn bg-info border-0 rounded-end-pill p-3 px-4 pe-xl-5 text-white font-size-2 font-size-4-xl" onClick={() => sendSignal('75', 'Zoom In')}>
                      <i className="bi bi-plus-circle-fill"></i>
                    </button>
                  </div>
                </div>
                <div className="col">
                {Array.from({ length: Math.ceil(numOfPresets / 2) }).map((_, rowIndex) => (
                      <Row key={rowIndex} className="">
                        {Array.from({ length: 2 }, (_, colIndex) => {
                          const presetNumber = rowIndex * 2 + colIndex + 1;
                          return (
                            presetNumber <= numOfPresets && (
                              <div key={presetNumber} className="col-6 pt-2 pt-xl-4 px-4">
                                  <button
                                  className='btn btn-info col-12 rounded-pill border-0 py-2 px-3 me-1 mb-3 mb-xl-4 presetButton'
                                  key={presetNumber}
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
                                </button>
                              </div>
                            )
                          );
                        })}
                      </Row>
                    ))}
                </div>
              </div>
                {/* Preset Rename Modal */}
                <Modal show={presetRenameMode} onHide={handleCancelPresetRename} fullscreen={fullscreen}>
                <Modal.Header closeButton>
                  <Modal.Title>
                    <h1 className="font-size-5 font-size-6-xl"><button type="button" className="border-0 text-dark"
                      onClick={handleCancelPresetRename}><i class="bi bi-arrow-left"></i></button>Rename Preset</h1>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div className="col-8 pt-5 mx-auto">
                    <input
                      className="form-control"
                      placeholder="Enter a new preset name"
                      value={newPresetName}
                      onChange={handleNewPresetNameChange} />
                  </div>
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
                {/* /Preset Rename Modal */}
              </div>
            </div>
          )}
        </CModal>      
    </div>
  );
};

export default BottomBar;

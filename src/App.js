import React, { useEffect, useState} from 'react';
import {Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import './App.css';
import HomePage from './components/HomePage'
import WelcomePage from './components/WelcomePage';
import CrComLib from "@crestron/ch5-crcomlib";
import { getWebXPanel, runsInContainerApp } from '@crestron/ch5-webxpanel';


window.bridgeReceiveIntegerFromNative = CrComLib.CrComLib.bridgeReceiveIntegerFromNative; 
window.bridgeReceiveBooleanFromNative = CrComLib.CrComLib.bridgeReceiveBooleanFromNative;
window.bridgeReceiveStringFromNative = CrComLib.CrComLib.bridgeReceiveStringFromNative;
window.bridgeReceiveObjectFromNative = CrComLib.CrComLib.bridgeReceiveObjectFromNative;
window.CrComLib = CrComLib.CrComLib;

const { WebXPanel, isActive, WebXPanelConfigParams, WebXPanelEvents } = getWebXPanel(!runsInContainerApp());
if (isActive) {
  WebXPanelConfigParams.host = '129.105.110.154';
  WebXPanelConfigParams.ipId = "4";
  
  WebXPanel.initialize(WebXPanelConfigParams);
}
function App() {
  const [programStarted, setProgramStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.addEventListener(WebXPanelEvents.CONNECT_WS, (detail) => {
      console.log(`WebXPanel websocket connection event: ${JSON.stringify(detail)}`);
    });
    window.addEventListener(WebXPanelEvents.ERROR_WS, (detail) => {
      console.log(`WebXPanel websocket error event: ${JSON.stringify(detail)}`);
    });
    window.addEventListener(WebXPanelEvents.CONNECT_CIP, (detail) => {
      console.log(`WebXPanel CIP connection event: ${JSON.stringify(detail)}`);
    });
    window.addEventListener(WebXPanelEvents.AUTHENTICATION_FAILED, (detail) => {
      console.log(`WebXPanel authentication failed event: ${JSON.stringify(detail)}`);
    });
    window.addEventListener(WebXPanelEvents.NOT_AUTHORIZED, (detail) => {
      console.log(`WebXPanel not authorized event event: ${JSON.stringify(detail)}`);
    });
    window.addEventListener(WebXPanelEvents.DISCONNECT_CIP, (detail) => {
      console.log(`WebXPanel CIP disconnection event: ${JSON.stringify(detail)}`);
    });
    window.addEventListener(WebXPanelEvents.DISCONNECT_WS, (detail) => {
      console.log(`WebXPanel websocket disconnection event: ${JSON.stringify(detail)}`);
    });
  }, []);

  useEffect(() => {
    window.CrComLib.subscribeState('b', '29', value=> {
      setProgramStarted(value)
      if (value) {
        navigate('/HomePage')
      } else {
        navigate('/WelcomePage')
      }
    });
    console.log('system status', programStarted)
    
}, []);
  const handleProgramStartedChange = () => {
    setProgramStarted(prevProgramStarted => !prevProgramStarted)
  }
  return (
    <div className="App">
      <Routes>
        <Route  index path="/WelcomePage" element={<WelcomePage programStarted={programStarted} setProgramStarted={handleProgramStartedChange}/>}/>
        <Route path="/HomePage" element={<HomePage programStarted={programStarted} setProgramStarted={handleProgramStartedChange}/>}/>
       
      </Routes>
    </div>
  );
}

export default App;

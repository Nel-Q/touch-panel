import logo from "./Icons/Northwestern_purple.svg"
import Header from './Header';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomePage.css'

function WelcomePage() {
  const navigate = useNavigate();

  const handleClick = () => {
      window.CrComLib.publishEvent('b','1', true);
      window.CrComLib.publishEvent('b','1', false);
      console.log("Signal sent to processor");
      navigate('/HomePage')
    };


  return (
    <div className="WelcomePage w-100" >
        <Header/>
        <div className="container py-5" onClick={handleClick}>
            <div className="row">
                <div className="col-8 mx-4 mb-5">
                    <img
                        src={logo}
                        alt="Northwestern Logo"
                        className="img-fluid bigger-image "/>
                </div>
            </div>
            <div className="row mt-5 align-items-center">
                <div className="col-12 text-center">
                    <h1 className="display-2">Welcome.</h1>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12 text-center">
                    <h2 className="display-4">Touch anywhere to get started.</h2>
                </div>
            </div>
        </div>
        
      

    </div>
  );
};

export default WelcomePage;

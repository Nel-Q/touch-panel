import { useEffect, useState } from "react";
import CrComLib from "@crestron/ch5-crcomlib";
import {Button} from 'react-bootstrap';
import AddIcon from './Icons/plus.svg';
import RemoveIcon from './Icons/dash.svg';
import './VolumeControl.css'

const VolumeControl = ({initialVolume, plusJoin, minusJoin, isMuted}) => {
  const [volume, setVolume] = useState(0);


  useEffect(() => {
    // Map decibels to the volume range (0 to 20)
    const mappedVolume = Math.round((initialVolume + 30) * (20 / 60));
    setVolume(mappedVolume);
  }, [initialVolume]);

  const handleIncreaseVolume = () => {
    if (volume < 20) {
      setVolume((prevVolume) => prevVolume + 1);
      window.CrComLib.publishEvent('b', `${plusJoin}`, true);
      window.CrComLib.publishEvent('b', `${plusJoin}`, false);
      console.log('volume increased')
    }
  };

  const handleDecreaseVolume = () => {
    if (volume > 0) {
      setVolume((prevVolume) => prevVolume - 1);
      window.CrComLib.publishEvent('b', `${minusJoin}`, true);
      window.CrComLib.publishEvent('b', `${minusJoin}`, false);
      console.log('volume decreased')
    }
  };
  useEffect(() => {
    // Map decibels to the volume range (0 to 20)
    if (!isMuted){
        const mappedVolume = Math.round((initialVolume + 30) * (20 / 60));
        setVolume(mappedVolume);
    }
    
  }, [initialVolume]);


  const renderSquares = () => {
    const squares = [];
    for (let i = 0; i < 20; i++) {
      squares.push(
        <div
          key={i}
          className={`square ${isMuted ? 'gray' : (i < volume ? 'filled' : '')}`}
        ></div>
      );
    }
    return squares;
  };

  return (
    <div className="volumeComponent">
        <div className="bg-info rounded-circle mr-3" onClick={handleDecreaseVolume}>
            <img
                src={RemoveIcon}
                alt="Minus Icon"
                className="img-fluid"/>
        </div>
        <div className="squaresContainer mr-3">{renderSquares()}</div>
        <div className="bg-info rounded-circle" onClick={handleIncreaseVolume}>
            <img
                src={AddIcon}
                alt="Plus Icon"
                className="img-fluid"/>
        </div>
        
    </div>
  );
};

export default VolumeControl;


import * as React from 'react';
import Header from './Header';
import BottomBar from './BottomBar';
import SourceMenus from './SourceMenus';
import './HomePage.css'


function HomePage(){



    return(
        <div className='container-fluid vh-100 m-0 p-0'>
            <Header className=""/>
            <div className='mainContent '>
                <SourceMenus className=''/>
            </div>
           
            <BottomBar className='p-0'/>
        </div>
    )

}

export default HomePage;
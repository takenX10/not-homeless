import React, { useState } from 'react';
import HouseParser from "./HouseParser";

import "./HouseConfig.css";

export default function HouseConfig({homePagesList}){
    const [showHouses, setShowHouses] = useState(false);
    if(showHouses){
        return (
            <HouseParser homePagesList={homePagesList} />
        );
    }else{
        return(
            <>
                
            </>
        );
    }
}
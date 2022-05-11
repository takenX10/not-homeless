import React, { useState } from "react";
import "./App.css";
import HouseConfig from "./HouseConfig"



export default function App(){   
    
    return (
            <>
                <div className="navbar">
                    <h1>NO homeless</h1>
                </div>
                <HouseConfig />
            </>
    );
}
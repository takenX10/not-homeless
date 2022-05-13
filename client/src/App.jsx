import React, { useState } from "react";
import "./App.css";
import HouseConfig from "./HouseConfig"



export default function App(){   
    
    return (
            <>
                <div className="navbar">
                    <h1 className="py-4">N0t homeless</h1>
                </div>
                <HouseConfig />
            </>
    );
}
import React, { useState } from "react";
import "./App.css";
import HouseConfig from "./HouseConfig"



export default function App(){
    const homePagesList = [
        {
            url:"https://www.immobiliare.it/affitto-case/bologna/?criterio=rilevanza&prezzoMassimo=1300&localiMinimo=3",
            query: {
                homePage:".in-pagination__list > .in-pagination__item:not(.in-pagination__item--current)",
                house: ".in-card__title",
                results: {
                    title: ".im-titleBlock__title",
                    description: ".im-description__text"
                }
            }
        }
    ];    
    
    return (
            <>
                <div className="navbar">
                    <h1>NO homeless</h1>
                </div>
                <HouseConfig homePagesList={homePagesList}/>
            </>
    );
}
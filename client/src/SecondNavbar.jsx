import React from 'react';
import { Button } from 'react-bootstrap';
import { startSearch } from './utils';


export default function SecondNavbar({ housesArray, setArray, urlList, blockedList, startSearch }) {
    console.log(urlList);
    return (
        <div className="container-fluid bg-success text-light info-navbar">
            <div className="row p-5 justify-content-center">
                <div className="col-3 justify-content-center">
                    <h3>Case da controllare: <b>{housesArray[0].length}</b></h3>
                </div>
                <div className="col-3 justify-content-center">
                    <h3>Case bloccate dai filtri: <b>{housesArray[1].length}</b></h3>
                </div>
                <div className="col-3 justify-content-center">
                    <h3>Case salvate: <b>{housesArray[3].length}</b></h3>
                </div>
                <div className="col-3 justify-content-center">
                    <h3>Case eliminate: <b>{housesArray[2].length}</b></h3>
                </div>
                <div className="col-5 mt-5 text-center">
                    <Button onClick={() => startSearch(urlList, blockedList, housesArray, setArray)}>Refresh ricerca</Button>
                </div>
            </div>
        </div>
    );
}
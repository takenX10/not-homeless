import React, { useState, useRef } from 'react';
import { Button, Tab, Tabs, Form } from 'react-bootstrap';
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css'
import HouseParser from "./HouseParser";
import "./HouseConfig.css";

const immobiliareQuery = {
    homePage:".in-pagination__list > .in-pagination__item:not(.in-pagination__item--current)",
    house: ".in-card__title",
    results: {
        title: ".im-titleBlock__title",
        description: ".im-description__text"
    }
};


export default function HouseConfig() {
    const [showHouses, setShowHouses] = useState(false);
    const [homeJson, setHomeJson] = useState([]);

    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => { return { url: 'https://httpbin.org/post' } }

    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = (files) => { console.log(files.map(f => f.meta)) }
    var immobiliareRef = useRef(null);
    function configureJson(){
        if(immobiliareRef.current.value != ""){
            setHomeJson(homeJson.push({
                url: immobiliareRef.current.value,
                query: immobiliareQuery
            }));
        }
        setHomeJson([].concat.apply([],homeJson));
        return homeJson.length > 0;
    }

    if (showHouses) {
        return (
            <HouseParser homeJson={homeJson} />
        );
    } else {
        return (
            <>
                <div className="container-fluid">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-8">
                            <Tabs defaultActiveKey="Automatica" id="uncontrolled-tab-example" className="m-5">
                                <Tab eventKey="Automatica" title="Configurazione Automatica" className="p-5 pt-1">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <Form>
                                                <Form.Group className="mb-3 fs-3" controlId="formBasicEmail">
                                                    <Form.Label>Link Immobiliare</Form.Label>
                                                    <Form.Control ref={immobiliareRef} type="immobiliare" placeholder="https://www.immobiliare.it/affitto-case/bologna/?criterio=rilevanza&prezzoMassimo=1300&localiMinimo=3" />
                                                    <Form.Text className="text-muted">
                                                        <a className="fs-6" href="https://www.immobiliare.it/">https://www.immobiliare.it/</a>
                                                    </Form.Text>
                                                </Form.Group>
                                                <Form.Group>
                                                    <Form.Label className="fs-2">Blacklist</Form.Label>
                                                    <Form.Control as="textarea" rows={8}></Form.Control>
                                                    <Form.Text className="text-muted">Una frase filtrata per riga</Form.Text>
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="Manuale" title="Configurazione Manuale" className="p-5 pt-1">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <Form>
                                                <Form.Group>
                                                    <Form.Label className="fs-2">Inserisci JSON</Form.Label>
                                                    <Form.Control as="textarea" rows={8}></Form.Control>
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    </div>
                                </Tab>
                                <Tab eventKey="Carica" title="Carica Ricerca" className="p-5 pt-1">
                                    <div className="container-fluid">
                                        <div className="row">
                                            <Form>
                                                <Form.Group className="d-flex carica align-items-center">
                                                    <Form.Label className="fs-2">Carica una ricerca passata</Form.Label>
                                                    <Dropzone
                                                        getUploadParams={getUploadParams}
                                                        onSubmit={handleSubmit}
                                                        accept="application/json"
                                                    />
                                                </Form.Group>
                                            </Form>
                                        </div>
                                    </div>
                                </Tab>
                            </Tabs>
                            <div className="container">
                                <div className="row justify-content-center align-items-center">
                                    <div className="col text-center">
                                        <Button variant="primary" className="fs-1 p-5 fw-bolder" onClick={()=>{
                                            if(configureJson()){
                                                setShowHouses(true);
                                            }else{
                                                /* TODO */
                                            }
                                            return;
                                        }}>Vai alla ricerca!</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>



            </>
        );
    }
}
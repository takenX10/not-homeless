import React, { useState, useRef, useEffect } from 'react';
import { Button, Tab, Tabs, Form } from 'react-bootstrap';
import Dropzone from 'react-dropzone-uploader';
import 'react-dropzone-uploader/dist/styles.css'
import HouseParser from "./HouseParser";
import "./HouseConfig.css";

const immobiliareQuery = {
    homePage: ".in-pagination__list > .in-pagination__item:not(.in-pagination__item--current)",
    house: "a.in-card__title",
    results: {
        title: ".im-titleBlock__title",
        description: ".im-description__text",
        price: ".im-mainFeatures__title"
    }
};

const idealistaQuery = {
    homePage: ".pagination > ul > li > a",
    house: ".item-link",
    results: {
        title: ".main-info__title-main",
        description: ".adCommentsLanguage",
        price: ".info-data-price > span"
    }
};

const subitoQuery = {
    homePage: ".pagination_pagination-button-wrapper__czWc4 > a",
    house: ".BigCard-module_link__kVqPE",
    results: {
        title: ".AdInfo_ad-info__title__7jXnY",
        description: ".AdDescription_description__gUbvH",
        price: ".AdInfo_ad-info__price__tGg9h"
    }
};


export default function HouseConfig() {
    const [showHouses, setShowHouses] = useState(false);
    const [homeJson, setHomeJson] = useState([]);
    const [blackList, setBlackList] = useState([]);
    const [backup, setBackup] = useState(false);
    const [configure, setConfigure] = useState(false);
    const serverRef = useRef(null);
    const immobiliareRef = useRef(null);
    const idealistaRef = useRef(null);
    const subitoRef = useRef(null);
    const blackListRef = useRef(null);

    function savedState(doUse) {
        if (doUse) {
            setShowHouses(true);
        } else {
            localStorage.removeItem("savedHouses");
            localStorage.removeItem("deletedHouses");
            localStorage.removeItem("searchedHouses");
            localStorage.removeItem("blockedHouses");
            localStorage.removeItem("homeJson");
            setBackup(false);
        }
    }
    useEffect(() => {
        setBackup(localStorage.getItem("savedHouses") || localStorage.getItem("deletedHouses") || localStorage.getItem("searchedHouses") || localStorage.getItem("blockedHouses") || localStorage.getItem("homeJson"));
    }, []);
    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => { return {} } /* TODO */

    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = (files) => { /**TODO */ }
    function configureJson() {
        var auxHomeJson = [];
        if (blackListRef.current.value) {
            setBlackList(blackListRef.current.value.split("\n"));
        }
        if (immobiliareRef.current.value !== "") {
            auxHomeJson.push({
                server: serverRef.current.value,
                domain: "https://www.immobiliare.it",
                url: immobiliareRef.current.value,
                query: immobiliareQuery
            });
        }
        if (idealistaRef.current.value !== "") {
            auxHomeJson.push({
                server: serverRef.current.value,
                domain: "https://www.idealista.it",
                url: idealistaRef.current.value,
                query: idealistaQuery
            });
        }
        if (subitoRef.current.value !== "") {
            auxHomeJson.push({
                server: serverRef.current.value,
                domain: "https://www.subito.it",
                url: subitoRef.current.value,
                query: subitoQuery
            })
        }
        setConfigure(false);
        setHomeJson(auxHomeJson);
        return true;
    }
    if (!(backup && !showHouses)) {
        if (configure) {
            return (
                <div className="container-fluid mt-5">
                    <div className="row justify-content-center align-items-center">
                        <div className="col-8">
                            <div className="container-fluid">
                                <div className="row">
                                    <Form>
                                        <Form.Group className="mb-3 fs-3" controlId="formBasicEmail">
                                            <Form.Label>Link Server locale</Form.Label>
                                            <Form.Control ref={serverRef} type="server" placeholder="http://localhost:3030/api/" defaultValue="http://localhost:3030/api/" />
                                        </Form.Group>
                                        <Form.Group className="mb-3 fs-3" controlId="formBasicEmail">
                                            <Form.Label>Link Immobiliare</Form.Label>
                                            <Form.Control ref={immobiliareRef} type="immobiliare" placeholder="https://www.immobiliare.it/affitto-case/bologna/?criterio=rilevanza&prezzoMassimo=1300&localiMinimo=3" defaultValue="https://www.immobiliare.it/affitto-case/bologna/?criterio=rilevanza&prezzoMassimo=1300&localiMinimo=3" />
                                            <Form.Text className="text-muted">
                                                <a className="fs-6" href="https://www.immobiliare.it/">https://www.immobiliare.it/</a>
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="mb-3 fs-3" controlId="formBasicEmail">
                                            <Form.Label>Link Idealista</Form.Label>
                                            <Form.Control ref={idealistaRef} type="idealista" placeholder="https://www.idealista.it/affitto-case/bologna-bologna/" />
                                            <Form.Text className="text-muted">
                                                <a className="fs-6" href="https://www.idealista.it/">https://www.idealista.it/</a>
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group className="mb-3 fs-3" controlId="formBasicEmail">
                                            <Form.Label>Link Subito</Form.Label>
                                            <Form.Control ref={subitoRef} type="Subito" placeholder="https://www.subito.it/annunci-emilia-romagna/affitto/appartamenti/bologna/bologna/" defaultValue="https://www.subito.it/annunci-emilia-romagna/affitto/appartamenti/bologna/bologna/" />
                                            <Form.Text className="text-muted">
                                                <a className="fs-6" href="https://www.subito.it/">https://www.subito.it/</a>
                                            </Form.Text>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="fs-2">Blacklist</Form.Label>
                                            <Form.Control ref={blackListRef} as="textarea" rows={8}></Form.Control>
                                            <Form.Text className="text-muted">Una frase filtrata per riga</Form.Text>
                                        </Form.Group>
                                    </Form>
                                </div>
                                <div className="row justify-content-center align-items-center">
                                    <div className="col text-center">
                                        <Button variant="primary" className="fs-1 p-5 fw-bolder" onClick={configureJson}>Riconfigura la ricerca</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (showHouses) {
            return (
                <HouseParser urlList={homeJson} blockedList={blackList} reconfigure={setConfigure} />
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
                                                        <Form.Label>Link Server locale</Form.Label>
                                                        <Form.Control ref={serverRef} type="server" placeholder="http://localhost:3030/api/" defaultValue="http://localhost:3030/api/" />
                                                    </Form.Group>
                                                    <Form.Group className="mb-3 fs-3" controlId="formBasicEmail">
                                                        <Form.Label>Link Immobiliare</Form.Label>
                                                        <Form.Control ref={immobiliareRef} type="immobiliare" placeholder="https://www.immobiliare.it/affitto-case/bologna/?criterio=rilevanza&prezzoMassimo=1300&localiMinimo=3" defaultValue="https://www.immobiliare.it/affitto-case/bologna/?criterio=rilevanza&prezzoMassimo=1300&localiMinimo=3" />
                                                        <Form.Text className="text-muted">
                                                            <a className="fs-6" href="https://www.immobiliare.it/">https://www.immobiliare.it/</a>
                                                        </Form.Text>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3 fs-3" controlId="formBasicEmail">
                                                        <Form.Label>Link Idealista</Form.Label>
                                                        <Form.Control ref={idealistaRef} type="idealista" placeholder="https://www.idealista.it/affitto-case/bologna-bologna/" />
                                                        <Form.Text className="text-muted">
                                                            <a className="fs-6" href="https://www.idealista.it/">https://www.idealista.it/</a>
                                                        </Form.Text>
                                                    </Form.Group>
                                                    <Form.Group className="mb-3 fs-3" controlId="formBasicEmail">
                                                        <Form.Label>Link Subito</Form.Label>
                                                        <Form.Control ref={subitoRef} type="Subito" placeholder="https://www.subito.it/annunci-emilia-romagna/affitto/appartamenti/bologna/bologna/" defaultValue="https://www.subito.it/annunci-emilia-romagna/affitto/appartamenti/bologna/bologna/" />
                                                        <Form.Text className="text-muted">
                                                            <a className="fs-6" href="https://www.subito.it/">https://www.subito.it/</a>
                                                        </Form.Text>
                                                    </Form.Group>
                                                    <Form.Group>
                                                        <Form.Label className="fs-2">Blacklist</Form.Label>
                                                        <Form.Control ref={blackListRef} as="textarea" rows={8}></Form.Control>
                                                        <Form.Text className="text-muted">Una frase filtrata per riga</Form.Text>
                                                    </Form.Group>
                                                </Form>
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey="Manuale" title="Configurazione Manuale" disabled className="p-5 pt-1">
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
                                    <Tab disabled eventKey="Carica" title="Carica Ricerca" className="p-5 pt-1">
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
                                            <Button variant="primary" className="fs-1 p-5 fw-bolder" onClick={() => {
                                                if (configureJson()) {
                                                    setShowHouses(true);
                                                } else {
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
    } else {
        return (
            <div className="container-fluid">
                <div className="row d-flex justify-content-center m-5 text-center">
                    <div className="col-12">
                        <h3 className='m-5'>Ho trovato un salvataggio, vuoi utilizzarlo?</h3>
                        <Button className="m-3 p-3 bg-success" onClick={() => { savedState(true) }}>Si</Button>
                        <Button className="m-3 p-3 bg-danger" onClick={() => { savedState(false) }}>No</Button>
                    </div>
                </div>
            </div>
        );
    }
}
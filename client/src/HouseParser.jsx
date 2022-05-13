import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import './styles.css';
import './HouseParser.css';
import { startSearch } from './utils';
import SecondNavbar from './SecondNavbar';


import HouseCard from './HouseCard';

export default function HouseParser({ urlList, blockedList }) {
    const [housesList, setHousesList] = useState([]);
    const [blockedHousesList, setBlockedHousesList] = useState([]);
    const [deletedHousesList, setDeletedHousesList] = useState([]);
    const [savedHousesList, setSavedHousesList] = useState([]);
    const [housesLoaded, setHousesLoaded] = useState(false);
    const [config, setConfig] = useState(urlList);

    const housesArray = [housesList, blockedHousesList, deletedHousesList, savedHousesList];
    const setArray = [setHousesList, setBlockedHousesList, setDeletedHousesList, setSavedHousesList];

    function addFunction(house) {
        savedHousesList.push(house);
        setSavedHousesList([...savedHousesList]);
        housesList.splice(housesList.indexOf(house), 1);
        setHousesList((housesList) => housesList.filter((val) => val != house));
    }

    function deleteFunction(house) {
        deletedHousesList.push(house);
        setDeletedHousesList([...deletedHousesList]);
        housesList.splice(housesList.indexOf(house), 1);
        setHousesList((housesList) => housesList.filter((val) => val != house));
    }
    useEffect(() => {
        if (housesLoaded) {
            localStorage.setItem("searchedHouses", JSON.stringify(housesList));
        }else{
            var savedHousesLocal = JSON.parse(localStorage.getItem("savedHouses"));
            setSavedHousesList(savedHousesLocal ? savedHousesLocal : []);
        }
    }, [housesList]);
    useEffect(() => {
        if (housesLoaded) {
            localStorage.setItem("savedHouses", JSON.stringify(savedHousesList));
        }else{
            var deletedHousesLocal = JSON.parse(localStorage.getItem("deletedHouses"));
            setDeletedHousesList(deletedHousesLocal ? deletedHousesLocal : []);
        }
    }, [savedHousesList]);
    useEffect(() => {
        if (housesLoaded) {
            localStorage.setItem("deletedHouses", JSON.stringify(deletedHousesList));
        }else{
            var blockedHousesLocal = JSON.parse(localStorage.getItem("blockedHouses"));
            setBlockedHousesList(blockedHousesLocal ? blockedHousesLocal : []);
        }
    }, [deletedHousesList]);
    useEffect(() => {
        if (housesLoaded) {
            localStorage.setItem("blockedHouses", JSON.stringify(blockedHousesList));
        }else{
            setHousesLoaded(true);
        }
    }, [blockedHousesList]);

    /* Start the search after all the localStorage houses loaded */
    useEffect(() => {
        var length = 0;
        housesArray.forEach((list) => {
            length += list.length;
        });
        if (!length) {
            startSearch(config, blockedList, housesArray, setArray);
        }
    }, [housesLoaded]);
    useEffect(()=>{
        var housesListLocal = JSON.parse(localStorage.getItem("searchedHouses"));
        setHousesList(housesListLocal ? housesListLocal : []); 
    }, [config])

    /* Load all the houses from local storage and the config json */
    useEffect(() => {
        if (!urlList.length) {
            var parsed = JSON.parse(localStorage.getItem("urlList"));
            if (typeof (parsed) == typeof (Object)) {
                setConfig([parsed]);
            } else {
                setConfig(parsed);
            }
        } else {
            setConfig(urlList);
            localStorage.setItem("urlList", JSON.stringify(urlList));
        }
          
    }, []);

    return (
        <>
            <SecondNavbar housesArray={housesArray} setArray={setArray} urlList={config} blockedList={blockedList} startSearch={startSearch}/>
            <div className="container-fluid p-5 mx-5">
                {
                    (housesList.length == 0 && blockedHousesList == 0 && savedHousesList == 0 && deletedHousesList == 0) ?
                        <h1 className='m-5 fs-2 text-center'>Loading ...</h1> :
                        <Tabs>
                            <Tab eventKey="Ricerca" title="Ricerca" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        housesList.map((house) => {
                                            return (<HouseCard key={house.href} house={house} addFunction={addFunction} deleteFunction={deleteFunction} />);
                                        })
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="Bloccate" title="Bloccate" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        blockedHousesList.map((house) => {
                                            return (<HouseCard key={house.href} house={house} addFunction={addFunction} deleteFunction={deleteFunction} />);
                                        })
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="Rimosse" title="Rimosse" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        deletedHousesList.map((house) => {
                                            return (<HouseCard key={house.href} house={house} addFunction={addFunction} deleteFunction={deleteFunction} />);
                                        })
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="Salvate" title="Salvate" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        savedHousesList.map((house) => {
                                            return (<HouseCard key={house.href} house={house} addFunction={addFunction} deleteFunction={deleteFunction} />);
                                        })
                                    }
                                </div>
                            </Tab>
                        </Tabs>
                }
            </div>
        </>
    );
}
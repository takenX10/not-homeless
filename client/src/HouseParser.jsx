import { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import './styles.css';
import './HouseParser.css';
import { startSearch } from './utils';
import SecondNavbar from './SecondNavbar';


import HouseCard from './HouseCard';

export default function HouseParser({ urlList, blockedList }) {
    /* 
        0 = lista case cercate
        1 = lista case bloccate dai filtri
        2 = lista case eliminate
        3 = lista case salvate
    */
    const [housesArray, setHousesArray] = useState([[],[],[],[]]);
    const [housesLoaded, setHousesLoaded] = useState(false);
    const [config, setConfig] = useState(urlList);
    function findAndRemove(toremove) {
        var newList = [];
        let i = 0;
        housesArray.forEach((houses) => {
            newList.push([]);
            houses.forEach((house)=>{
                if(house !== toremove) {
                    newList[i].push(house);
                }
            });
            i++;
        })
        return newList;
    }

    function addFunction(house) {
        setHousesArray((current) =>{
            let newcurrent = findAndRemove(house);
            return [[...newcurrent[0]], [...newcurrent[1]], [...newcurrent[2]], [...newcurrent[3], house]]
        });
    }
    
    function deleteFunction(house) {
        setHousesArray((current) => {
            let newcurrent = findAndRemove(house);
            return [[...newcurrent[0]], [...newcurrent[1]], [...newcurrent[2], house], [...newcurrent[3]]]
        });
    }

    function housesArraySize(){
        var length = 0;
        housesArray.forEach((list) => {
            length += list.length;
        });
        return length;
    }

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
            localStorage.setItem("urlList", JSON.stringify(urlList));
            setConfig(urlList);
        }
    }, []);

    useEffect(()=>{
        var housesListLocal = JSON.parse(localStorage.getItem("searchedHouses"));
        var blockedHousesLocal = JSON.parse(localStorage.getItem("blockedHouses"));
        var deletedHousesLocal = JSON.parse(localStorage.getItem("deletedHouses"));
        var savedHousesLocal = JSON.parse(localStorage.getItem("savedHouses"));
        setHousesArray([housesListLocal ? housesListLocal : [],  blockedHousesLocal? blockedHousesLocal : [], deletedHousesLocal ? deletedHousesLocal : [], savedHousesLocal ? savedHousesLocal : []]);
    }, [config])

    useEffect(() => {
        if(housesLoaded){
            localStorage.setItem("searchedHouses", JSON.stringify(housesArray[0]));
            localStorage.setItem("blockedHouses", JSON.stringify(housesArray[1]));
            localStorage.setItem("deletedHouses", JSON.stringify(housesArray[2]));
            localStorage.setItem("savedHouses", JSON.stringify(housesArray[3]));
        }else{
            setHousesLoaded(true);
        }
    }, [housesArray]);
    
    /* Start the search after all the localStorage houses loaded */
    useEffect(() => {
        
        if (!housesArraySize()) {
            startSearch(config, blockedList, housesArray, setHousesArray);
        }
    }, [housesLoaded]);
    

    return (
        <>
            <SecondNavbar housesArray={housesArray} setHousesArray={setHousesArray} urlList={config} blockedList={blockedList} startSearch={startSearch}/>
            <div className="container-fluid p-5 mx-5">
                {
                    ((housesArray[0].length + housesArray[1].length + housesArray[2].length + housesArray[3].length) == 0 ) ?
                        <h1 className='m-5 fs-2 text-center'>Loading ...</h1> :
                        <Tabs>
                            <Tab eventKey="Ricerca" title="Ricerca" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        housesArray[0].map((house) => {
                                            return (<HouseCard key={house.href} house={house} addFunction={addFunction} deleteFunction={deleteFunction} />);
                                        })
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="Bloccate" title="Bloccate" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        housesArray[1].map((house) => {
                                            return (<HouseCard key={house.href} house={house} addFunction={addFunction} deleteFunction={deleteFunction} />);
                                        })
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="Rimosse" title="Rimosse" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        housesArray[2].map((house) => {
                                            return (<HouseCard key={house.href} house={house} addFunction={addFunction} deleteFunction={deleteFunction} />);
                                        })
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="Salvate" title="Salvate" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        housesArray[3].map((house) => {
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
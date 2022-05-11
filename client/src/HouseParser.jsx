import { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { Tab, Tabs } from 'react-bootstrap';
import './styles.css';
import './HouseParser.css';
import parse from 'html-react-parser';

const BASEURL = "http://localhost:3030/api/";

async function postData(url, data) {
    return fetch(`${BASEURL}${url}`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((data) => data.json());
}

async function getPages(pagesList, query) {
    return await postData("getPagesFromHomePage", { homeUrl: pagesList, pagesQuery: query }).then((data) => data.pages)
}

async function getHouses(pages, query) {
    return await postData("getHousesFromPage", { pageUrl: pages, houseQuery: query }).then((data) => {
        return data.houses
    });
}

async function getHouseResult(houseUrl, query) {
    return await postData("getHouseResult", { houseUrl: houseUrl, houseResultQuery: query });
}

function isBlocked(house, filters) {
    if (filters) {
        for (let i = 0; i < filters.length; i++) {
            if (house.description.toLowerCase().includes(filters[i].toLowerCase())) {
                var regexp = new RegExp(filters[i] , "i"); //  case insensitive regexp
                house.description = parse(house.description.replace(regexp , '<b className="text-danger">$&</b>'));
                return house;
            }
        }
    }
    return null;
}

export default function HouseParser({ homeJson: homeJson, blockedList: blockedList }) {
    const [pagesList, setHomePagesList] = useState([]);
    const [housesList, setHousesList] = useState([]);
    const [blockedHousesList, setBlockedHousesList] = useState([]);
    const [deletedHousesList, setDeletedHousesList] = useState([]);
    const [savedHousesList, setSavedHousesList] = useState([]);

    function addDeleted(house){
        /*deletedHousesList.push(house);
        housesList.splice(housesList.indexOf(house), 1);
        setDeletedHousesList([...deletedHousesList]);
        setHousesList([...housesList]); */
    }
    
    const HouseCard = ({ house }) => {
        return (
            <div className="row d-flex justify-content-center align-items-center m-3">
                <div className="col-6 border border-left-0 border-secondary border-width-2 p-4">
                    <h1 className='fs-1'>{house.title}</h1>
                    <p>{house.description}</p>
                    <a href={house.href}>{house.href}</a>
                </div>
                <div className="col-2 card-buttons-container">
                    <Button variant='success' className="m-2" onClick={addDeleted(house)}>Si</Button>
                    <Button variant='danger' className="m-2">no</Button>
                </div>
            </div>
        );
    }

    useEffect(() => {
        homeJson.forEach(async (homePage) => {
            getPages(homePage.url, homePage.query.homePage).then(async (pages) => {
                setHomePagesList(homeJson.concat(pages));
                pages.forEach(async (page) => {
                    getHouses(page, homePage.query.house).then(async (houses) => {
                        houses.forEach(async (house) => {
                            let result = await getHouseResult(house, homePage.query.results);
                            result.href = house;
                            console.log(blockedList);
                            var blocked = isBlocked(result, blockedList);
                            if (blocked) {
                                blockedHousesList.push(blocked);
                                setBlockedHousesList([...blockedHousesList]);
                            } else {
                                housesList.push(result)
                                setHousesList([...housesList]);
                            }
                        });
                    });
                });
            });
        });
    }, []);

    return (
        <>
            <div className="container-fluid bg-success text-light info-navbar">
                <div className="row p-5">
                    <div className="col-3 justify-content-center">
                        <h3>Case trovate: <b>{housesList.length}</b></h3>
                    </div>
                    <div className="col-3 justify-content-center">
                        <h3>Case bloccate dai filtri: <b>{blockedHousesList.length}</b></h3>
                    </div>
                </div>
            </div>
            <div className="container-fluid p-5 mx-5">
                {
                    (housesList.length == 0 && blockedHousesList == 0 && savedHousesList == 0 && deletedHousesList == 0) ?
                        <h1 className='m-5 fs-2 text-center'>Loading ...</h1> :
                        <Tabs>
                            <Tab eventKey="Ricerca" title="Ricerca" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        housesList.map((house) => {
                                            return (<HouseCard key={house.href} house={house} />);
                                        })
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="Bloccate" title="Bloccate" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        blockedHousesList.map((house) => {
                                            console.log(house);
                                            return (<HouseCard key={house.href} house={house} />);
                                        })
                                    }
                                </div>
                            </Tab>
                            <Tab eventKey="Rimosse" title="Rimosse" className="p-5 pt-1">
                                <div className="container-fluid">
                                    {
                                        deletedHousesList.map((house) => {
                                            console.log(house);
                                            return (<HouseCard key={house.href} house={house} />);
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

/**
 * 
 */
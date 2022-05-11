import { useEffect, useState, Link } from 'react';
import { Button } from 'react-bootstrap';
import './styles.css';
import './HouseParser.css';

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

function isGood(houseUrl) {
    /* TODO */
    return true;
}

export default function HouseParser({ homeJson: homeJson }) {
    const [pagesList, setHomePagesList] = useState([]);
    const [housesList, setHousesList] = useState([]);
    useEffect(()=>{
        console.log(housesList);
    }, [housesList]);
    useEffect(() => {
        homeJson.forEach(async (homePage) => {
            getPages(homePage.url, homePage.query.homePage).then(async (pages) => {
                setHomePagesList(homeJson.concat(pages));
                pages.forEach(async (page) => {
                    getHouses(page, homePage.query.house).then(async (houses) => {
                        houses.forEach(async (house) => {
                            if (isGood(house)) {
                                let result = await getHouseResult(house, homePage.query.results);
                                result.href = house;
                                setHousesList([...housesList, result]);
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
                </div>
            </div>
            
            <div className="container-fluid">
                {
                    housesList.map((house) => {
                        console.log(house);
                        return (
                            <div key={house.href} className="row d-flex justify-content-center align-items-center m-3">
                                <div className="col-6 border border-left-0 border-secondary border-width-2 p-4">
                                    <h1 className='fs-1'>{house.title}</h1>
                                    <p>{house.description}</p>
                                    <a href={house.href}>{house.href}</a>
                                </div>
                                <div className="col-2 card-buttons-container">
                                    <Button variant='success' className="m-2">Si</Button>
                                    <Button variant='warning' className="m-2">salva per dopo</Button>
                                    <Button variant='danger' className="m-2">no</Button>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </>
    );
}
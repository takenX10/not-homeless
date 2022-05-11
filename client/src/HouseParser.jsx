import { useEffect, useState } from 'react';
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

export default function HouseParser({ homePagesList, }) {

    const [pagesList, setHomePagesList] = useState([]);
    const [housesList, setHousesList] = useState([]);
    useEffect(() => {
        homePagesList.forEach(async (homePage) => {
            getPages(homePage.url, homePage.query.homePage).then(async (pages) => {
                setHomePagesList(homePagesList.concat(pages));
                pages.forEach(async (page) => {
                    getHouses(page, homePage.query.house).then(async (houses) => {
                        houses.forEach(async (house) => {
                            if (isGood(house)) {
                                let result = await getHouseResult(house, homePage.query.results);
                                result.href = house;
                                console.log(housesList);
                                setHousesList(housesList.concat([result]));
                            }
                        });
                    });
                });
            });
        });
    }, []);

    return (
        <>
            <div className="text">
                <p>Houses: {housesList.length}, pages: {pagesList.length}</p>
            </div>
            <div className="house-container">
                {
                    housesList.map((house) => {
                        console.log(house);
                        return (
                            <>
                                <div className="house">
                                    <h2 className="title">{house.title}</h2>
                                    <p className="house-description">{house.description}</p>
                                    <a href={house.href} className="house-href">{house.href}</a>
                                </div>
                            </>
                        );
                    })
                }
            </div>
        </>
    );
}
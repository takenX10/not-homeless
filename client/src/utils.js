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

async function getPages(pagesList, query, pagesDomain) {
    return await postData("getPagesFromHomePage", { homeUrl: pagesList, domain: pagesDomain, pagesQuery: query }).then((data) => data.pages)
}

async function getHouses(pages, query, housesDomain) {
    return await postData("getHousesFromPage", { pageUrl: pages, domain: housesDomain, houseQuery: query }).then((data) => {
        return data.houses
    });
}

async function getHouseResult(houseUrl, query, resultDomain) {
    return await postData("getHouseResult", { houseUrl: houseUrl, domain: resultDomain, houseResultQuery: query });
}

function isBlocked(house, filters) {
    if (filters) {
        for (let i = 0; i < filters.length; i++) {
            if (house.description.toLowerCase().includes(filters[i].toLowerCase())) {
                var regexp = new RegExp(filters[i], "i"); //  case insensitive regexp
                house.description = parse(house.description.replace(regexp, '<b className="text-danger">$&</b>'));
                return house;
            }
        }
    }
    return null;
}

function notPresent(href, housesArray) {
    for (let i = 0; i < housesArray.length; i++) {
        for (let j = 0; j < housesArray[i].length; j++) {
            if (housesArray[i][j].href === href) {
                return false
            }
        }
    }
    return true;
}

/**
 * housesArray ha gli array con tutte le case, 
 * housesArray di 0 ha la lista di case da cercare -> setArray[0] ha la funzione di set delle case da cercare
 * housesArray di 1 ha la lista di case bloccate dai filtri -> setArray[1] ha la funzione di set delle case bloccate dai filtri
 * 
 */
export function startSearch(json, filters, housesArray, setHousesArray) {
    json.forEach(async (homePage) => {
        getPages(homePage.url, homePage.query.homePage, homePage.domain).then(async (pages) => {
            pages.forEach(async (page) => {
                getHouses(page, homePage.query.house, homePage.domain).then(async (houses) => {
                    houses.forEach(async (house) => {
                        //if (notPresent(house, housesArray)) {
                            let result = await getHouseResult(house, homePage.query.results, homePage.domain);
                            result.href = house;
                            var blocked = isBlocked(result, filters);
                            if (blocked) {
                                setHousesArray((current)=>(notPresent(house, current)?[[...current[0]], [...current[1], blocked], [...current[2]], [...current[3]]]:[...current]));
                            } else {
                                setHousesArray((current)=>(notPresent(house, current)?[[...current[0], result], [...current[1]], [...current[2]], [...current[3]]]:[...current]));
                            }
                        //}
                    });
                });
            });
        });
    });
}
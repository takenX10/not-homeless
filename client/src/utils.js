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
                var regexp = new RegExp(filters[i], "i"); //  case insensitive regexp
                house.description = parse(house.description.replace(regexp, '<b className="text-danger">$&</b>'));
                return house;
            }
        }
    }
    return null;
}

function notPresent(href, housesArray) {
    housesArray.forEach((list) => {
        list.forEach((house) => {
            if (house.href == href) {
                return true;
            }
        });
    });
    return true;
}

/**
 * housesArray ha gli array con tutte le case, 
 * housesArray di 0 ha la lista di case da cercare -> setArray[0] ha la funzione di set delle case da cercare
 * housesArray di 1 ha la lista di case bloccate dai filtri -> setArray[1] ha la funzione di set delle case bloccate dai filtri
 * 
 */
export function startSearch(json, filters, housesArray, setArray){
    console.log("search started");
    console.log(json);
    json.forEach(async (homePage) => {
        getPages(homePage.url, homePage.query.homePage).then(async (pages) => {
            pages.forEach(async (page) => {
                getHouses(page, homePage.query.house).then(async (houses) => {
                    houses.forEach(async (house) => {
                        if (notPresent(house.url, housesArray)) {
                            let result = await getHouseResult(house, homePage.query.results);
                            result.href = house;
                            var blocked = isBlocked(result, filters);
                            if (blocked) {
                                housesArray[1].push(blocked);
                                setArray[1]([...housesArray[1]]);
                            } else {
                                housesArray[0].push(result)
                                setArray[0]([...housesArray[0]]);
                            }
                        }
                    });
                });
            });
        });
    });
}
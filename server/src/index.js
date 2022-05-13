const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
app.use(bodyParser.json())

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const PORT = 3030;

async function getPagesFromHomePage(homeUrl, pagesQuery){
    return fetch(homeUrl).then((response)=>{return response.text().then((text)=>{
        const dom = new JSDOM(text);
        return (Array.from(dom.window.document.querySelectorAll(pagesQuery), (element)=>{return element.href})).concat(homeUrl);
    })});
}

async function getHousesFromPage(pagesUrl, housesQuery){
    if(typeof(pagesUrl) !== typeof([])){
        pagesUrl = [pagesUrl];
    }
    var promises = [];
    pagesUrl.forEach((page)=>{
        promises.push(fetch(page).then((response)=>{
            return response.text().then((text)=>{
                const dom = new JSDOM(text);
                return Array.from(dom.window.document.querySelectorAll(housesQuery), (element)=>{return element.href});
            });
        }));
    });
    return await [].concat.apply([],await Promise.all(promises));
}

async function getHouseResults(houseUrl, houseResultQuery){
    if(typeof(houseUrl) !== typeof([])){
        houseUrl = [houseUrl];
    }
    var promises = [];
    houseUrl.forEach((house)=>{
        promises.push(
            fetch(house).then((response)=>{return response.text().then((text)=>{
                const dom = new JSDOM(text);
                return {
                    title:dom.window.document.querySelector(houseResultQuery.title).textContent,
                    description:dom.window.document.querySelector(houseResultQuery.description).textContent,
                    price: dom.window.document.querySelector(houseResultQuery.price).textContent
                }
            })})
        );
    });
    return await Promise.all(promises);
}

app.post('/api/getHouseResult', async(req,res)=>{
    console.log("get house info");
    var resp = await getHouseResults(req.body.houseUrl, req.body.houseResultQuery);
    res.json(resp[0]);
});

app.post('/api/getHousesFromPage', async(req, res)=>{
    console.log("get houses list");
    res.json({
        "houses": await getHousesFromPage(req.body.pageUrl, req.body.houseQuery)
    });
});

app.post('/api/getPagesFromHomePage', async(req, res)=>{
    console.log("get pages");
    res.json({
        pages: await getPagesFromHomePage(req.body.homeUrl, req.body.pagesQuery)
    });
});


app.listen(PORT, () => console.log(`Server ready on port: ${PORT}`));
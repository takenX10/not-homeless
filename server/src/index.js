const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
app.use(bodyParser.json())

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


const PORT = 3030;
const DEBUG_PRINT = true;

function isFullUrl(url){
    if(url.substring(0,4) == "http"){
        return true;
    }
    return false;
}

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
    var url = isFullUrl(req.body.houseUrl) ? req.body.houseUrl : req.body.domain + req.body.houseUrl;
    if(DEBUG_PRINT){
        console.log(`get house info from ${url}`);
    }
    var resp = await getHouseResults(url, req.body.houseResultQuery);
    res.json(resp[0]);
});

app.post('/api/getHousesFromPage', async(req, res)=>{
    var url = isFullUrl(req.body.pageUrl) ? req.body.pageUrl : req.body.domain + req.body.pageUrl;
    if(DEBUG_PRINT){
        console.log(`get houses list from ${url}`);
    }
    res.json({
        "houses": await getHousesFromPage(url, req.body.houseQuery)
    });
});

app.post('/api/getPagesFromHomePage', async(req, res)=>{
    var url = isFullUrl(req.body.homeUrl) ? req.body.homeUrl : req.body.domain + req.body.homeUrl;
    if(DEBUG_PRINT){
        console.log(`get pages from ${url}`);
    }
    res.json({
        pages: await getPagesFromHomePage(req.body.homeUrl, req.body.pagesQuery)
    });
});


app.listen(PORT, () => console.log(`Server ready on port: ${PORT}`));
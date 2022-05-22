const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
app.use(bodyParser.json())

var browser = null;

const PORT = 3030;
const DEBUG_PRINT = true;

function isFullUrl(url){
    if(url.substring(0,4) == "http"){
        return true;
    }
    return false;
}

async function getPagesFromHomePage(homeUrl, pagesQuery){
    const page = await browser.newPage();
    await page.goto(homeUrl);
    const nodes = await page.$$(pagesQuery);
    let res = (Array.from(nodes, async(element)=>{element = await element.getProperty('href'); return await element.jsonValue()})).concat(homeUrl);
    res = await Promise.all(res);
    page.close();
    return res;
}

async function getHousesFromPage(pageUrl, housesQuery){
    const page = await browser.newPage();
    await page.goto(pageUrl);
    const nodes = await page.$$(housesQuery);
    let res = (Array.from(nodes, async(element)=>{element = await element.getProperty('href'); return await element.jsonValue()}));
    res = await Promise.all(res);
    page.close();
    return res;
}

async function getHouseResults(houseUrl, houseResultQuery){
    const page = await browser.newPage();
    await page.goto(houseUrl);
    var title = await page.$(houseResultQuery.title);
    var description = await page.$(houseResultQuery.description);
    var price = await page.$(houseResultQuery.price);
    title = title.getProperty('innerText').then((val) => val.jsonValue());
    price = price.getProperty('innerText').then((val) => val.jsonValue());
    description = description.getProperty('innerText').then((val) => val.jsonValue());
    title = await title;
    price = await price;
    description = await description;
    console.log(title, description, price);
    page.close();
    return {
        title:title,
        description:description,
        price:price
    };
}

app.post('/api/getHouseResult', async(req,res)=>{
    var url = isFullUrl(req.body.houseUrl) ? req.body.houseUrl : req.body.domain + req.body.houseUrl;
    if(DEBUG_PRINT){
        console.log(`get house info from ${url}`);
    }
    var resp = await getHouseResults(url, req.body.houseResultQuery);
    res.json(resp);
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

(async () => {
    browser = await puppeteer.launch({
        headless: true
    });
})();
app.listen(PORT, () => console.log(`Server ready on port: ${PORT}`));
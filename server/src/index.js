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
                    description:dom.window.document.querySelector(houseResultQuery.description).textContent
                }
            })})
        );
    });
    return await Promise.all(promises);
}

app.post('/api/getHouseResult', async(req,res)=>{
    console.log("get result");
    var resp = await getHouseResults(req.body.houseUrl, req.body.houseResultQuery);
    res.json(resp[0]);
    /*res.json({ title: "Quadrilocale via Adelaide Borghi Mamo, Colli Murri, Bologna", description: "\n            Rif. A01 • Via Borghi Mamo. Proponiamo in affitto, nell'elegante zona pedecollinare del quartiere Murri, ampio appartamento di 110mq sito al 1° piano con ascensore di una palazzina ottimamente tenuta.\nL'appartamento è composto da ingresso sull'ampio soggiorno di 30mq con accesso al terrazzo abitabile di 32mq che affaccia sulla zona interna, 2 camere da letto matrimoniali, cucina abitabile con balcone, bagno finestrato con box doccia.\nCompletano la proprietà la cantina ed il box auto.\n\nL'appartamento dispone di aria condizionata, pavimento in palladiana nel soggiorno e nelle camere e ceramica nella cucina e nel bagno e riscaldamento centralizzato con conta calorie.\n\nCONTATTACI PER RICEVERE MAGGIORI INFORMAZIONI\n\nUfficio Tempocasa Murri, D.R. Immobiliare Murri s.r.l.\nVia Augusto Murri, 168/a • 40137 Bologna\nTel 051-6237689\nbolognamurri@tempocasa.it\n\nAvviso: tutti i nostri collaboratori adotteranno le misure di sicurezza previste dal DCPM del 09/03/2020.\nLe visite agli immobili vengono effettuate previa sottoscrizione del foglio visita/privacy.\nLa Geolocalizzazione dell’immobile potrebbe essere approssimativa.\n\nQUARTIERE MURRI\n\nL’area Murri è posta ai piedi della collina, comprende il principale parco della città, i “Giardini Margherita” e il parco Gamberini, attrazioni che regalano ai cittadini svago e aria aperta a volontà. Zona alquanto elegante, presenta un’ottima distribuzione degli spazi con edifici bassi medio-piccoli circondati da gradevoli giardini ed è caratterizzata principalmente da costruzioni che vanno dagli anni ’30 agli anni ’60, ad eccezione di alcuni interventi edili più recenti.\n\nLe scuole di ogni tipo sono numerose (ben diciassette) e variano dalle scuole internazionali ad asili, primarie e secondarie pubbliche o private.\nZona principalmente a vocazione abitativa e studi professionali.\n        ", href: "https://www.immobiliare.it/annunci/94880960/" });*/
});

app.post('/api/getHousesFromPage', async(req, res)=>{
    /*res.json({
        "houses":["https://www.immobiliare.it/annunci/94657296/"]
    })*/
    console.log("get houses");
    res.json({
        "houses": await getHousesFromPage(req.body.pageUrl, req.body.houseQuery)
    });
});

app.post('/api/getPagesFromHomePage', async(req, res)=>{
    console.log("get homes");
    /*res.json({
        "pages": ["page1", "page2"]
    })*/
    console.log(req.body.homeUrl);
    res.json({
        pages: await getPagesFromHomePage(req.body.homeUrl, req.body.pagesQuery)
    });
});


app.listen(PORT, () => console.log(`Server ready on port: ${PORT}`));
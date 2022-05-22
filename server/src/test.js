const jsdom = require("jsdom");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const {JSDOM} = jsdom;

fetch("https://www.subito.it/annunci-emilia-romagna/affitto/appartamenti/bologna/bologna/").then((res)=>res.text().then((text)=>{
    const dom = new JSDOM(text);
    console.log(text);
    //console.log(dom.window.document.querySelectorAll(".pagination > ul > li > a")[0]);
}));
const { GetHTML, Search, Home, Popular, GetInfo, Anime } = require("./Util.js");
const express = require('express'), cheerio = require("cheerio"), fetch = require("node-fetch");
const app = express();

const Endpoints = ["/search/name (/search/to+love+ru)", "/info/name (/info/to-love-ru)", "/home", "/popular", "/random"];
 
app.get('/', function (req, res) {
  res.status(200).send({ endpoints: Endpoints })
});

app.get('/home', async (req, res) => {
    const HTML = await GetHTML(`https://animekisa.tv/`);
    const Data = await Home(HTML);
    return res.status(200).send(Data);
});

app.get('/home/:number', async (req, res) => {
   const HTML = await GetHTML(`https://animekisa.tv/latest/${parseInt(req.params.number)}`);
   const Data = await Home(HTML);
   return res.status(200).send(Data);
});

app.get('/dubbed', async (req, res) => {
    const HTML = await GetHTML(`https://animekisa.tv/dubbed/`);
    const Data = await Home(HTML);
    return res.status(200).send(Data);
});

app.get('/dubbed/:number', async (req, res) => {
   const HTML = await GetHTML(`https://animekisa.tv/dubbed/latest/${parseInt(req.params.number)}`);
   const Data = await Home(HTML);
   return res.status(200).send(Data);
});

app.get('/popular', async (req, res) => {
   const HTML = await GetHTML(`https://animekisa.tv/popular`);
   const Data = await Popular(HTML);
   return res.status(200).send(Data);
});

app.get('/popular/:number', async (req, res) => {
   const HTML = await GetHTML(`https://animekisa.tv/popular/${parseInt(req.params.number)}`);
   const Data = await Popular(HTML);
   return res.status(200).send(Data);
});

app.get('/popularall', async (req, res) => {
   const HTML = await GetHTML(`https://animekisa.tv/popular-alltime`);
   const Data = await Popular(HTML);
   return res.status(200).send(Data);
});

app.get('/popularall/:number', async (req, res) => {
   const HTML = await GetHTML(`https://animekisa.tv/popular-alltime/${parseInt(req.params.number)}`);
   const Data = await Popular(HTML);
   return res.status(200).send(Data);
});

app.get('/populardub', async (req, res) => {
   const HTML = await GetHTML(`https://animekisa.tv/popular/dubbed`);
   const Data = await Popular(HTML);
   return res.status(200).send(Data);
});

app.get('/populardub/:number', async (req, res) => {
   const HTML = await GetHTML(`https://animekisa.tv/popular/dubbed/${parseInt(req.params.number)}`);
   const Data = await Popular(HTML);
   return res.status(200).send(Data);
});

app.get('/popularduball', async (req, res) => {
   const HTML = await GetHTML(`https://animekisa.tv/popular-alltime/dubbed`);
   const Data = await Popular(HTML);
   return res.status(200).send(Data);
});

app.get('/popularduball/:number', async (req, res) => {
   const HTML = await GetHTML(`https://animekisa.tv/popular-alltime/dubbed/${parseInt(req.params.number)}`);
   const Data = await Popular(HTML);
   return res.status(200).send(Data);
});

app.get('/anime', async (req, res) => {
   const HTML = await GetHTML("https://animekisa.tv/anime");
   const Data = await Anime(HTML);
   return res.status(200).send(Data);
});

app.get('/random', async (req, res) => {
    const HTML = await GetHTML("https://animekisa.tv/random.php");
    const Data = await GetInfo(HTML);
    return res.status(200).send(Data);
});

app.get('/search/:name', async (req, res) => {
    const HTML = await GetHTML(`https://animekisa.tv/search?q=${req.params.name}`);
    const Data = await Search(HTML);
    return res.status(200).send(Data);
});

app.get('/info/:name', async (req, res) => {
    const HTML = await GetHTML(`https://animekisa.tv/${req.params.name}`);
    const Data = await GetInfo(HTML);
    return res.status(200).send(Data);
});

app.use(function (req, res) {
    res.status(404).send({ forbidden: true, error: true });
});
 
app.listen(6969, async () => {
  console.log("Running - " + 6969)
});
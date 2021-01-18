const express = require('express'), cheerio = require("cheerio"), fetch = require("node-fetch");
const app = express();

const Endpoints = ["/anime/name (/anime/to+love+ru)", "/info/name (/info/to-love-ru)", "/home", "/popular", "/random"];
 
app.get('/', function (req, res) {
  res.send({ endpoints: Endpoints })
});

app.get('/anime/:name', async (req, res) => {
    const text = await (await fetch(encodeURI(`https://animekisa.tv/search?q=${req.params.name}`))).text();
    const data = await GetData(text);
    return res.send(data);
});

app.get('/info/:name', async (req, res) => {
    const text = await (await fetch(encodeURI(`https://animekisa.tv/${req.params.name}`))).text();
    const data = await GetDat(text);
    return res.send(data);
});

app.get('/home', async (req, res) => {
    const text = await (await fetch(encodeURI(`https://animekisa.tv/`))).text();
    const data = await GetDa(text);
    return res.send(data);
});

app.get('/popular', async (req, res) => {
    const text = await (await fetch(encodeURI(`https://animekisa.tv/popular`))).text();
    const data = await GetD(text);
    return res.send(data);
});

app.get('/random', async (req, res) => {
    const text = await (await fetch(encodeURI("https://animekisa.tv/random.php"))).text();
    const data = await GetDat(text);
    return res.send(data);
});

async function GetData(HTML) {
  const $ = await cheerio.load(HTML);
  const arr = []
  const all = await $(".similarboxmain .similarbox a").each((i, ani) => {
    const obj = {
      title: $(ani).find(".centered .similardd").text(),
      genre: $(ani).find(".similardd-categories").text(),
      image: `https://animekisa.tv` + $(ani).find(".similarpic img").attr("src"),
      url: `https://animekisa.tv` + $(ani).attr("href")
    };
    if (obj.title != "") arr.push(obj);
  });
  return arr
};

async function GetDat(HTML) {
  const $ = await cheerio.load(HTML);
  const image = `https://animekisa.tv/` + $(".infopicbox img").attr("src")
  const title = $(".infodesbox h1").text();
  const info = await $(".infodes2");
  const alias = await info.children().eq(await $(".infodes2 .textd:contains('Alias:')").index() + 1).text();
  const status = await info.children().eq(await $(".infodes2 .textd:contains('Status:')").index() + 1).text();
  const ep = await info.children().eq(await $(".infodes2 .textd:contains('Episodes:')").index() + 1).text();
  const storyline = await $(".infodesbox .infodes2").first().text();
  const links = [], category = [], eplinks = [];
  $(".infodes2 .textc a").each((i, an) => {
    const href =  $(an).attr("href");
    if (!href.startsWith("/")) links.push(href);
    if (href.startsWith("/")) category.push($(an).text());
  });
  $(".infoepbox a").each((i, ani) => {
    eplinks.push("https://animekisa.tv/" + $(ani).attr("href"));
  });
  const obj = {
    title: title,
    alias: alias,
    image: image,
    category: category,
    status: status,
    storyline: storyline.includes("\nStatus") ? null : storyline,
    episodes: ep,
    episodeslink: eplinks.reverse(),
    links: links
  };
  if (obj.title != "") return obj;
  return {}
};

async function objec(options = {}) {
  return {
    title: options.name,
    image: options.image,
    category: options.category,
    link: options.link
  };
}

async function GetDa(HTML) {
  const $ = await cheerio.load(HTML);
  const alled = [];
  const all = $(".listAnimes").children().each(async (i, an) => {
    const name = $(an).find(".title-box .title-box-2").text();
    const image = "https://animekisa.tv" + $(an).find(".image-box img").attr("src");
    const link = "https://animekisa.tv/" + $(an).find("a").attr("href");
    alled.push(await objec({ name: name, image: image, link: link}))
  });
  const obj = {
    items: alled
  };
  return obj;
};

async function GetD(HTML) {
  const $ = await cheerio.load(HTML);
  const alled = [];
  const all = $(".listAnimes").children().each(async (i, an) => {
    const name = $(an).find(".centered .similardd").text().replace(`${i+1}. `, "");
    const image = "https://animekisa.tv" + $(an).find(".similarpic img").attr("src");
    const category = $(an).find(".centered .similardd-categories").text().split(", ");
    const link = "https://animekisa.tv" + $(an).find("a").attr("href");
    alled.push(await objec({ name: name, image: image, link: link, category: category }))
  });

  const obj = {
    items: alled
  };

  return obj;
};

app.use(function (req, res) {
    res.status(404).send("Not Found, Try Again Later.");
});
 
app.listen(6969, async () => {
  console.log("Running - " + 6969)
});
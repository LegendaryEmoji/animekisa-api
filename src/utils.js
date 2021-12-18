const {
    checkForCache,
    addToCache
} = require("./cache.js"), {
    cache,
    BASE_URL
} = require("../config.js");
const cheerio = require("cheerio").default,
    axios = require("axios").default;

async function getRawHTML(path) {
    const { data } = await axios.get(BASE_URL + path, { responseType: "text" });
    return data;
}

async function getNormal(path) {
    if (cache && checkForCache(path)) return checkForCache(path);

    const $ = cheerio.load(await getRawHTML(path));
    const elements = { statusCode: 000, message: [] };

    $(".listAnimes").children().each((anchorIndex, anchorElement) => {
        _$ = $(anchorElement);
        if (!_$.find(".title-box-2").text().trim())
            return;



        elements.message.push({
            image: BASE_URL + _$.find(".image-box img").attr("src"),
            title: _$.find(".title-box-2").text().trim(),
            base: _$.find("a[class='an']").eq(2).attr("href"),
            episodeUrl: BASE_URL + _$.find("a[class='an']").first().attr("href"),
            url: BASE_URL + _$.find("a[class='an']").eq(2).attr("href")
        });
    });

    elements.statusCode = elements.message.length > 1 ? 200 : 204;

    if (cache && elements.statusCode === 200)
        addToCache(path, elements);



    return elements;
};

async function getPopular(path) {
    if (cache && checkForCache(path)) return checkForCache(path);

    const $ = cheerio.load(await getRawHTML(path));
    const elements = { statusCode: 000, message: [] };

    $(".listAnimes").children().each((anchorIndex, anchorElement) => {
        _$ = $(anchorElement);
        const title = _$.find(".similardd").text().split(". ");
        const obj = {
            position: parseInt(title[0]),
            image: BASE_URL + _$.find(".similarpic img").attr("src"),
            title: title.slice(1).join(""),
            base: _$.attr("href"),
            categories: _$.find(".similardd-categories").text() ? _$.find(".similardd-categories").text().split(", ") : []
        };
        if (obj.title)
            elements.message.push(obj);



    });

    elements.statusCode = elements.message.length > 1 ? 200 : 204; 

    if (cache && elements.statusCode === 200)
        addToCache(path, elements);



    return elements;
};

async function getAnime() {
    if (cache && checkForCache("/anime")) return checkForCache("/anime");
    const $ = cheerio.load(await getRawHTML("/anime"));
    const elements = { statusCode: 000, message: [] };

    $(".lisbox").has(".an").children().each((anchorIndex, anchorElement) => {
        _$ = $(anchorElement);
        const obj = {
            title: _$.find(".lis").text(),
            base: _$.attr("href"),
            url: BASE_URL + _$.attr("href")
        };
        if (obj.title)
            elements.message.push(obj);



    });

    elements.statusCode = elements.message.length > 1 ? 200 : 204;

    if (cache && elements.statusCode === 200)
        addToCache("/anime", elements);



    return elements;
}

async function getInformation(base, save = true) {
    if (save && cache && checkForCache(base)) return checkForCache(base);

    const i = (str) => `.textd:contains('${str}')`;
    const $ = cheerio.load(await getRawHTML(base));

    const obj = {
        statusCode: 000,
        message: {
            image: BASE_URL + "/" + $("img[class='posteri']").attr("src"),
            title: $("h1[class='infodes']").text() || null,
            base: null,
            alias: $(`.infodes2 ${
                i("Alias:")
            }`).next().text() || null,
            status: $(i("Status:")).next().text() || null,
            summary: $(".infodes2").first().text().startsWith("\nStatus:") ? null : $(".infodes2").first().text() || null,
            categories: $(i("Categories:")).next().text() ? $(i("Categories:")).next().text().trim().split(", ") : [],
            episodes: {
                total: 0,
                list: []
            },
            sources: []  
        }
    }

    $(".infoepbox a").each((anchorIndex, anchorElement) => obj.message.episodes.list.push({
        position: parseInt($(anchorElement).find(".infoept2 .centerv").text()),
        url: BASE_URL + "/" + $(anchorElement).attr("href")
    }))

    $(i("Related Content:")).next().find(".infoan").each((anchorIndex, anchorElement) => obj.message.sources.push($(anchorElement).attr("href")));


    obj.statusCode = obj.message.image.endsWith("undefined") ? 404 : 200;
    obj.message.episodes.total = obj.message.episodes.list.length;
    if (obj.message.episodes.list[0]) obj.message.base = obj.message.episodes.list[0].url.split("animekisa.tv")[1].split("-episode")[0]

    if (save && cache)
        addToCache(base, obj);



    return obj;
};

module.exports = {
    getNormal,
    getPopular,
    getAnime,
    getInformation
};
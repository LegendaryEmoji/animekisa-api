const {cacheLifeTime} = require("../config.js");

const cachedData = {};

const checkForCache = (typeOfData) => cachedData[typeOfData] ? cachedData[typeOfData] : null

function addToCache(dataType, scrapedData) {
    cachedData[dataType] = scrapedData;
    setTimeout(() => {
        cachedData[dataType] = null;
    }, cacheLifeTime || 60 * 1000);
    return scrapedData
}

module.exports = {
    checkForCache,
    addToCache
};

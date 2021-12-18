module.exports = {
    "cache": true,
    "cacheLifeTime": 60 * 1000,
    "port": 8080,
    "logger": true,
    "BASE_URL": "https://animekisa.tv",
    "messages": {
        "noPageFound": "Page not found, please check the URL.",
        "errorPage": "Something went wrong, try again later.",
        "defaultPage": null,
    },
    "endpoints": {
        "/": {
            "description": "The root.",
            "method": "GET",
            "responseCodes": [200],
            "options": {
                "query": []
            }
        },
        "/latest": {
            "description": "GET the latest updates.",
            "method": "GET",
            "responseCodes": [
                200, 204
            ],
            "options": {
                "query": [
                    {
                        "name": "pageNumber",
                        "type": "number",
                        "required": false,
                        "description": "Specific page number to scrape."
                    }, {
                        "name": "dub",
                        "type": "boolean",
                        "required": false,
                        "description": "Latest dubbed or subbed, set dub to true for dubbed."
                    }
                ]
            }
        },
        "/popular": {
            "description": "GET the popular list of animes.",
            "method": "GET",
            "responseCodes": [
                200, 204
            ],
            "options": {
                "query": [
                    {
                        "name": "all",
                        "type": "boolean",
                        "required": false,
                        "description": "Popular of all-time or popular of weekly, set all to true for all-time."
                    }, {
                        "name": "dub",
                        "type": "boolean",
                        "required": false,
                        "description": "Popular dubbed or subbed, set dub to true for dubbed."
                    }
                ]
            }
        },
        "/information": {
            "description": "GET the information of the anime.",
            "method": "GET",
            "responseCodes": [
                404, 200
            ],
            "options": {
                "query": [
                    {
                        "name": "base",
                        "type": "string",
                        "required": true,
                        "description": "Base required for scraping the anime information, you will get this property from every scraped object."
                    }
                ]
            }
        },
        "/anime": {
            "description": "GET all animes list that are available on AnimeKisa.",
            "method": "GET",
            "responseCodes": [200],
            "options": {
                "query": []
            }
        }
    }
};

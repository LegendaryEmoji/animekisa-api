const {getPopular} = require("../utils.js");

/**
 * @param {import("fastify").FastifyInstance} fastify 
 */

async function route(fastify) {
    fastify.get("/popular", async ({
        query
    }, reply) => {
        let path = "/";
        if (query.all && query.all === "true") 
            path += query.dub && query.dub === "true" ? "popular-alltime/dubbed" : "popular-alltime";
        


        if (path === "/") 
            path += query.dub && query.dub === "true" ? "popular/dubbed" : "popular";
        
        if (query.pageNumber) path += `/${query.pageNumber}`
        

        const data = await getPopular(query.pageNumber ? `${path}/${
            query.pageNumber
        }` : path);
        return reply.status(data.statusCode).send(data)
    });
};

module.exports = route;

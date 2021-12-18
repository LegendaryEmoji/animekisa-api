const {getNormal} = require("../utils.js");

/**
 * @param {import("fastify").FastifyInstance} fastify 
 */

async function route(fastify) {
    fastify.get("/latest", async ({
        query
    }, reply) => {
        let path = "/";
        if (query.dub && query.dub === "true") path += query.pageNumber ? `dubbed/latest/${query.pageNumber}` : "dubbed";
        if (path == "/") path += query.pageNumber ? `latest/${query.pageNumber}` : ""
        const data = await getNormal(path)
        return reply.status(data.statusCode).send(data);
    });
};

module.exports = route;

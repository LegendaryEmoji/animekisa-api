const {getAnime} = require("../utils.js");

/**
 * @param {import("fastify").FastifyInstance} fastify 
 */

async function route(fastify) {
    fastify.get("/anime", async ({
        query
    }, reply) => {
        const data = await getAnime();
        return reply.status(data.statusCode).send(data);
    });
};

module.exports = route;

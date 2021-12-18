const {getInformation} = require("../utils.js");

/**
 * @param {import("fastify").FastifyInstance} fastify 
 */

async function route(fastify) {
    fastify.get("/random", async ({
        query
    }, reply) => {
        const data = await getInformation("/random.php", false);
        return reply.status(data.statusCode).send(data);
    });
};

module.exports = route;

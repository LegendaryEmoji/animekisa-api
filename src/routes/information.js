const {getInformation} = require("../utils.js");

/**
 * @param {import("fastify").FastifyInstance} fastify 
 */

async function route(fastify) {
    fastify.get("/information", async ({
        query
    }, reply) => {
        if (!query.base || !query.base.startsWith("/")) 
            return reply.status(400).send({statusCode: 400, message: "Missing or invalid query.base, each anime response object has a 'base' property, please pass it in query (?base=<base>)"});
        


        const data = await getInformation(query.base);
        return reply.status(data.statusCode).send(data);
    });
};

module.exports = route;

const {logger, port, messages, endpoints} = require("./config.js");
const fastify = require("fastify").default({logger: logger});
const routeList = require("fs").readdirSync("./src/routes");
const PORT = port || process.env.PORT || 8080;

fastify.setNotFoundHandler((request, reply) => reply.status(404).send({statusCode: 404, message: messages.noPageFound || "Not found" }));
fastify.setErrorHandler((request, reply) => reply.status(500).send({statusCode: 500, message: messages.errorPage || "Something went wrong from server-side."}) )
fastify.get("/", (request, reply) => reply.status(200).send({statusCode: 200, message: messages.defaultPage || endpoints }));

for (const route of routeList) {
    fastify.register(require(`./src/routes/${route}`));
};

(async () => {
    try {
        fastify.listen(PORT).then(() => console.log(`Running on port: ${port}`));
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    };
})();

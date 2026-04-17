const { program } = require("commander");
const http = require("node:http");
const fs = require("fs/promises");

program
    .requiredOption("-h, --host <host>", "server address")
    .requiredOption("-p, --port <port>", "server's port", (port) => parseInt(port, 10))
    .requiredOption("-c, --cache <path>", "path to a directory which contains cached files");

program.parse();
const options = program.opts();

async function main() {
    try {
        if (Number.isNaN(options.port)) {
            throw new Error("Invalid port specified.");
        }

        await fs.mkdir(options.cache, {recursive: true});
    
        const server = http.createServer((request, response) => {
            response.writeHead(200);
            response.end("Hello");
        });
        
        server.listen(options.port, options.host, () => {
            console.log(`Listening on ${options.host}:${options.port}.`);
        });

        process.on("SIGINT", () => {
            server.close(() => {
                console.log("Server was successfully closed.");
                process.exit(0);
            });
        })
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
}

main();
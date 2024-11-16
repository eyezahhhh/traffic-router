import { Route } from "./route";
import * as FS from "fs";
import * as Net from "net";

const routes: Route[] = JSON.parse(FS.readFileSync("routes.json", "utf-8"));

console.log("Routes:", routes);

for (let route of routes) {
    console.log(`Routing traffic from port "${route.port}" to "${route.to.host}" on port "${route.to.port}"...`);

    const server = Net.createServer((incoming) => {
        const outgoing = Net.createConnection(route.to);
        incoming.pipe(outgoing);
        outgoing.pipe(incoming);

        incoming.on("error", error => {
            console.error("Incoming error", error);
            incoming.destroy();
            outgoing.destroy();
        });

        outgoing.on("error", error => {
            console.error("Outgoing error", error);
            outgoing.destroy();
            incoming.destroy();
        });
    });

    server.listen(route.port, "0.0.0.0");
}
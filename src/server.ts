// import config
import { CONFIG } from "./config";

// import Logger
import { Logger } from "./Logger";

// import typeorm
import { createConnection } from "typeorm";

// import koa
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as json from "koa-json";

// import routers

const startServer = async () => {
    try {
        // create connection to database
        const connection = await createConnection();

        // create app
        const app = new Koa();

        // apply middleware
        app.use(bodyparser({
            enableTypes: ["json"],
            jsonLimit: CONFIG.JSON_LIMIT,
            strict: true
        }));
        app.use(json());

        // apply routers

        // listen on port
        app.listen(CONFIG.PORT, () => {
            Logger.INFO(`Listening on :${CONFIG.PORT}`);
        });
    }
    catch (error) {
        Logger.ERRO(`Error starting server, ${error}`);
    }
};

// start server
startServer();
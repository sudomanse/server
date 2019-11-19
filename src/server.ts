// import config
import { CONFIG } from "./config";

// import Logger
import { Logger } from "./Logger";

// import fs
import { readFileSync } from "fs";

// import typeorm
import { createConnection } from "typeorm";

// import koa
import * as Koa from "koa";
import * as bodyparser from "koa-bodyparser";
import * as json from "koa-json";
import * as cors from "@koa/cors";

// import routers
import { authRouter } from "./router/Auth";
import { inputRouter } from "./router/Input";
import { outputRouter } from "./router/Output";
// import { readingRouter } from "./router/Reading";
import { stationRouter } from "./router/Station";
import { userRouter } from "./router/User";

// import helpers
import { MqttClient } from "./helper/MqttClient";
import { JWT } from "./helper/JWT";

// start server
const startServer = async () => {
    try {
        // create connection to database
        const connection = await createConnection();

        // create app
        const app = new Koa();

        // create MQTT helper
        const mqtt = MqttClient;
        await mqtt.start();

        // create JWT helper
        const privateKey = await readFileSync(CONFIG.JWT_PRIVATE_KEY_LOCATION);
        const publicKey = await readFileSync(CONFIG.JWT_PUBLIC_KEY_LOCATION);
        JWT.init(privateKey,  publicKey, "HS256");

        app.use(cors());

        // apply middleware
        app.use(bodyparser({
            enableTypes: ["json"],
            jsonLimit: CONFIG.BODYPARSER_JSON_LIMIT,
            strict: true
        }));
        app.use(json());

        // apply routers
        app.use(inputRouter.routes());
        app.use(inputRouter.allowedMethods());
        app.use(outputRouter.routes());
        app.use(outputRouter.allowedMethods());
        // app.use(readingRouter.routes());
        // app.use(readingRouter.allowedMethods());
        app.use(stationRouter.routes());
        app.use(stationRouter.allowedMethods());
        app.use(userRouter.routes());
        app.use(userRouter.allowedMethods());
        app.use(authRouter.routes());
        app.use(authRouter.allowedMethods());

        // listen on port
        app.listen(CONFIG.SERVER_PORT, () => {
            Logger.INFO(`Listening on :${CONFIG.SERVER_PORT}`);
        });

        return app;
    }
    catch (error) {
        Logger.CRIT(`Error starting server, ${error}`);
    }
};
const app = startServer();
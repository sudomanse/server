// import config
import { CONFIG } from "../config";

// import Logger
import { Logger } from "../Logger";

// import router
import * as Router from "koa-router";

// import controller
import { inputController } from "../controller/Input";
import { verifyJwt } from "../middleware/Auth";
import {outputController} from "../controller/Output";
import {outputRouter} from "./Output";

// create new Input router
const inputRouter = new Router();

// define Input routes
inputRouter.post("/api/v1/user/:userId/station/:stationId/input", verifyJwt, async (context, next) => {
    Logger.TRAC("[POST] /api/v1/user/:userId/station/:stationId/input");

    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate input
    if ((! stationId) || (! userId)) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["incorrect query parameters"],
            data: null
        };
        return;
    }

    // empty Input
    let input: any = {};
    // validate body
    if (context.request.body["name"]) {
        input.name = context.request.body["name"];
    }
    if (context.request.body["description"]) {
        input.description = context.request.body["description"];
    }
    if (context.request.body["type"]) {
        input.type = context.request.body["type"];
    }
    else {
        input.type = "BASIC";
    }
    if (context.request.body["mqttAddress"]) {
        input.mqttAddress = context.request.body["mqttAddress"];
    }
    if (context.request.body["mqttTopic"]) {
        input.mqttTopic = context.request.body["mqttTopic"];
    }
    if (context.request.body["mqttWifiSsid"]) {
        input.mqttWifiSsid = context.request.body["mqttWifiSsid"];
    }
    if (context.request.body["mqttWifiPassword"]) {
        input.mqttWifiPassword = context.request.body["mqttWifiPassword"];
    }

    try {
        // create Input
        let createInput = await inputController.createInput(stationId, input);
        // response
        context.status = 201;
        context.body = {
            result: "success",
            errors: null,
            data: [createInput]
        };
        return;
    }
    catch (error) {
        Logger.ERRO(error);
        // response
        context.status = 500;
        context.body = {
            result: "failure",
            errors: ["failed to create Input"],
            data: null
        };
        return;
    }

});
inputRouter.get("/api/v1/user/:userId/station/:stationId/input", verifyJwt, async (context, next) => {
    Logger.TRAC("[GET] /api/v1/user/:userId/station/:stationId/input");

    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate input
    if ((! stationId) || (! userId)) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["incorrect query parameters"],
            data: null
        };
        return;
    }

    try {
        // read all Inputs
        let readInputs = await inputController.readAllInputs(userId, stationId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: readInputs
        };
        return;
    } catch (error) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["failed to read Inputs"],
            data: null
        };
        return;
    }

});
inputRouter.get("/api/v1/user/:userId/station/:stationId/input/:inputId", verifyJwt, async (context, next) => {
    Logger.TRAC("[GET] /api/v1/user/:userId/station/:stationId/input/:inputId");

    // input id
    let inputId: number = context.params.inputId;
    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate input
    if ( (! inputId) || (! stationId) || (! userId) ) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["incorrect query parameters"],
            data: null
        };
        return;
    }

    try {
        let readInput = await inputController.readInput(userId, stationId, inputId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: readInput
        };
        return;
    } catch (error) {
        Logger.ERRO(error);
        // response
        context.status = 500;
        context.body = {
            result: "failure",
            errors: ["failed to read Input"],
            data: null
        };
        return;
    }

});
inputRouter.patch("/api/v1/user/:userId/station/:stationId/input/:inputId", verifyJwt, async (context, next) => {
    Logger.TRAC("[PATCH] /api/v1/user/:userId/station/:stationId/input/:inputId");

    // input id
    let inputId: number = context.params.inputId;
    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate input
    if ( (! inputId) || (! stationId) || (! userId) ) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["incorrect query parameters"],
            data: null
        };
        return;
    }

    // empty Input
    let input: any = {};
    // validate body
    if (context.request.body["name"]) {
        input.name = context.request.body["name"];
    }
    if (context.request.body["description"]) {
        input.description = context.request.body["description"];
    }
    if (context.request.body["type"]) {
        input.type = context.request.body["type"];
    }

    try {
        let updateInput = await inputController.updateInput(userId, stationId, inputId, input);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: updateInput
        };
        return;
    } catch (error) {
        // response
        context.status = 400;
        context.body = {
            result: "failure",
            errors: ["failed to update Input"],
            data: null
        };
        return;
    }
});
inputRouter.delete("/api/v1/user/:userId/station/:stationId/input/:inputId", verifyJwt, async (context, next) => {
    Logger.TRAC("[DELETE] /api/v1/user/:userId/station/:stationId/input/:inputId");

    // input id
    let inputId: number = context.params.inputId;
    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate input
    if ( (! inputId) || (! stationId) || (! userId) ) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["incorrect query parameters"],
            data: null
        };
        return;
    }

    try {
        // delete Input
        let deleteInput = await inputController.deleteInput(userId, stationId, inputId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: deleteInput
        };
        return;
    } catch (error) {
        // response
        context.status = 400;
        context.body = {
            result: "failure",
            errors: ["failed to delete Input"],
            data: null
        };
        return;
    }

});

inputRouter.post("/api/v1/user/:userId/station/:stationId/input/:inputId/query", verifyJwt, async (context, next) => {
// inputRouter.post("/api/v1/user/:userId/station/:stationId/input/:inputId/query", async (context, next) => {
    Logger.TRAC("[POST] /api/v1/user/:userId/station/:stationId/input/input:id/query");

    // input id
    let inputId: number = context.params.inputId;
    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate input
    if ( (! inputId) || (! stationId) || (! userId) ) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["incorrect query parameters"],
            data: null
        };
        return;
    }

    // empty Input
    let query: any = {};
    // validate body
    if (context.request.body["to"]) {
        query.to = context.request.body["to"];
    }
    if (context.request.body["from"]) {
        query.from = context.request.body["from"];
    }
    if (context.request.body["limit"]) {
        query.limit = context.request.body["limit"];
    }

    try {
        let readInput = await inputController.query(userId, stationId, inputId, query);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: readInput
        };
        return;
    } catch (error) {
        Logger.ERRO(error);
        // response
        context.status = 500;
        context.body = {
            result: "failure",
            errors: ["failed to read Input"],
            data: null
        };
        return;
    }
});
inputRouter.get("/api/v1/user/:userId/station/:stationId/input/:inputId/config", verifyJwt, async (context, next) => {
    Logger.TRAC("[POST] /api/v1/user/:userId/station/:stationId/input/:inputId/config");

    // input id
    let inputId: number = context.params.inputId;
    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate input
    if ( (! inputId) || (! stationId) || (! userId) ) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["incorrect query parameters"],
            data: null
        };
        return;
    }

    try {
        // get Input config
        let getConfig = await inputController.getConfig(userId, stationId, inputId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: getConfig
        };
        return;
    } catch (error) {
        Logger.ERRO(`${error}`);
        // response
        context.status = 400;
        context.body = {
            result: "failure",
            errors: ["failed to get config for Input"],
            data: null
        };
        return;
    }
});

// export 
export { inputRouter };
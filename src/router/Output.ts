// import config
import { CONFIG } from "../config";

// import Logger
import { Logger } from "../Logger";

// import router
import * as Router from "koa-router";

// import controller
import { outputController } from "../controller/Output";

// import middleware
import { verifyJwt } from "../middleware/Auth";

// create new Output router
const outputRouter = new Router();

// define Output routes
outputRouter.post("/api/v1/user/:userId/station/:stationId/output", verifyJwt, async (context, next) => {
    Logger.TRAC("[POST] /api/v1/user/:userId/station/:stationId/output");

    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate output
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

    // empty Output
    let output: any = {};
    // validate body
    if (context.request.body["name"]) {
        output.name = context.request.body["name"];
    }
    if (context.request.body["description"]) {
        output.description = context.request.body["description"];
    }
    if (context.request.body["state"]) {
        output.state = context.request.body["state"];
    }
    if (context.request.body["mqttAddress"]) {
        output.mqttAddress = context.request.body["mqttAddress"];
    }
    if (context.request.body["mqttTopic"]) {
        output.mqttTopic = context.request.body["mqttTopic"];
    }
    if (context.request.body["mqttWifiSsid"]) {
        output.mqttWifiSsid = context.request.body["mqttWifiSsid"];
    }
    if (context.request.body["mqttWifiPassword"]) {
        output.mqttWifiPassword = context.request.body["mqttWifiPassword"];
    }

    try {
        // create Output
        let createOutput = await outputController.createOutput(stationId, output);
        // response
        context.status = 201;
        context.body = {
            result: "success",
            errors: null,
            data: [createOutput]
        };
        return;
    }
    catch (error) {
        Logger.ERRO(error);
        // response
        context.status = 500;
        context.body = {
            result: "failure",
            errors: ["failed to create Output"],
            data: null
        };
        return;
    }

});
outputRouter.get("/api/v1/user/:userId/station/:stationId/output", verifyJwt, async (context, next) => {
    Logger.TRAC("[GET] /api/v1/user/:userId/station/:stationId/output");

    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate output
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
        // read all Outputs
        let readOutputs = await outputController.readAllOutputs(userId, stationId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: readOutputs
        };
        return;
    } catch (error) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["failed to read Outputs"],
            data: null
        };
        return;
    }

});
outputRouter.get("/api/v1/user/:userId/station/:stationId/output/:outputId", verifyJwt, async (context, next) => {
    Logger.TRAC("[GET] /api/v1/user/:userId/station/:stationId/output/:outputId");

    // output id
    let outputId: number = context.params.outputId;
    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate output
    if ( (! outputId) || (! stationId) || (! userId) ) {
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
        let readOutput = await outputController.readOutput(userId, stationId, outputId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: readOutput
        };
        return;
    } catch (error) {
        Logger.ERRO(error);
        // response
        context.status = 500;
        context.body = {
            result: "failure",
            errors: ["failed to read Output"],
            data: null
        };
        return;
    }

});
outputRouter.patch("/api/v1/user/:userId/station/:stationId/output/:outputId", verifyJwt, async (context, next) => {
    Logger.TRAC("[PATCH] /api/v1/user/:userId/station/:stationId/output/:outputId");

    // output id
    let outputId: number = context.params.outputId;
    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate output
    if ( (! outputId) || (! stationId) || (! userId) ) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["incorrect query parameters"],
            data: null
        };
        return;
    }

    // empty Output
    let output: any = {};
    // validate body
    if (context.request.body["description"]) {
        output.description = context.request.body["description"];
    }

    try {
        let updateOutput = await outputController.updateOutput(userId, stationId, outputId, output);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: updateOutput
        };
        return;
    } catch (error) {
        // response
        context.status = 400;
        context.body = {
            result: "failure",
            errors: ["failed to update Output"],
            data: null
        };
        return;
    }
});
outputRouter.delete("/api/v1/user/:userId/station/:stationId/output/:outputId", verifyJwt, async (context, next) => {
    Logger.TRAC("[DELETE] /api/v1/user/:userId/station/:stationId/output/:outputId");

    // output id
    let outputId: number = context.params.outputId;
    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate output
    if ( (! outputId) || (! stationId) || (! userId) ) {
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
        // delete Output
        let deleteOutput = await outputController.deleteOutput(userId, stationId, outputId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: deleteOutput
        };
        return;
    } catch (error) {
        // response
        context.status = 400;
        context.body = {
            result: "failure",
            errors: ["failed to delete Output"],
            data: null
        };
        return;
    }

});

outputRouter.post("/api/v1/user/:userId/station/:stationId/output/:outputId/control", verifyJwt, async (context, next) => {
    Logger.TRAC("[POST] /api/v1/user/:userId/station/:stationId/output/:outputId/control");

    // output id
    let outputId: number = context.params.outputId;
    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate output
    if ( (! outputId) || (! stationId) || (! userId) ) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["incorrect query parameters"],
            data: null
        };
        return;
    }

    // empty State
    let state: any = {};
    // validate body
    if (context.request.body["state"]) {
        state = context.request.body["state"];
    }

    try {
        // control Output
        let controlOutput = await outputController.controlOutput(userId, stationId, outputId, state);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: controlOutput
        };
        return;
    } catch (error) {
        // response
        context.status = 400;
        context.body = {
            result: "failure",
            errors: ["failed to control Output"],
            data: null
        };
        return;
    }
});
outputRouter.get("/api/v1/user/:userId/station/:stationId/output/:outputId/config", verifyJwt, async (context, next) => {
    Logger.TRAC("[POST] /api/v1/user/:userId/station/:stationId/output/:outputId/config");

    // output id
    let outputId: number = context.params.outputId;
    // station id
    let stationId: number = context.params.stationId;
    // user id
    let userId: number = context.params.userId;
    // validate output
    if ( (! outputId) || (! stationId) || (! userId) ) {
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
        // get Output config
        let getConfig = await outputController.getConfig(userId, stationId, outputId);
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
            errors: ["failed to get config for Output"],
            data: null
        };
        return;
    }
});

// export 
export { outputRouter };
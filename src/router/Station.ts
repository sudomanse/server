// import config
import { CONFIG } from "../config";

// import Logger
import { Logger } from "../Logger";

// import router
import * as Router from "koa-router";

// import uuid
import { v4 } from "uuid";

// import controller
import { stationController } from "../controller/Station";

// import middleware
import { verifyJwt } from "../middleware/Auth";

// create new Station router
const stationRouter = new Router();

// define Station routes
stationRouter.post("/api/v1/user/:userId/station", verifyJwt, async (context, next) => {
    Logger.TRAC("[POST] /api/v1/user/:userId/station");

    // user id
    let userId: number = context.params.userId;
    // validate input
    if (! userId) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["incorrect query parameters"],
            data: null
        };
        return;
    }

    // empty Station
    let station: any = {};
    // validate body
    if (context.request.body["name"]) {
        station.name = context.request.body["name"];
    }
    if (context.request.body["description"]) {
        station.description = context.request.body["description"];
    }

    try { 
        // create Station
        let createStation = await stationController.createStation(userId, station);
        // response
        context.status = 201;
        context.body = {
            result: "success",
            errors: [null],
            data: createStation
        };
        return;
    }
    catch (error) {
        Logger.ERRO(error);
        // response
        context.status = 500;
        context.body = {
            result: "failure",
            errors: ["failed to create Station"],
            data: null
        };
        return;
    }

});
stationRouter.get("/api/v1/user/:userId/station", verifyJwt, async (context, next) => {
    Logger.TRAC("[GET] /api/v1/user/:userId/station");

    // user id
    let userId: number = context.params.userId;
    // validate input
    if (! userId) {
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
        // read all Stations
        let readStations = await stationController.readAllStations(userId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: readStations
        };
        return;
    } catch (error) {
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["failed to read Stations"],
            data: null
        };
        return;
    }

});
stationRouter.get("/api/v1/user/:userId/station/:stationId", verifyJwt, async (context, next) => {
    Logger.TRAC("[GET] /api/v1/user/:userId/station/:stationId");

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
        let readStation = await stationController.readStation(userId, stationId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: readStation
        };
        return;
    } catch (error) {
        // response
        context.status = 500;
        context.body = {
            result: "failure",
            errors: ["failed to read Station"],
            data: null
        };
        return;
    }

});
stationRouter.patch("/api/v1/user/:userId/station/:stationId", verifyJwt, async (context, next) => {
    Logger.TRAC("[PATCH] /api/v1/user/:userId/station/:stationId");

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

    // empty Station
    let station: any = {};
    // validate body
    if (context.request.body["name"]) {
        station.name = context.request.body["name"];
    }
    if (context.request.body["description"]) {
        station.description = context.request.body["description"];
    }

    try {
        let updateStation = await stationController.updateStation(userId, stationId, station);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: updateStation
        };
        return;
    } catch (error) {
        // response
        context.status = 400;
        context.body = {
            result: "failure",
            errors: ["failed to update Station"],
            data: null
        };
        return;
    }
});
stationRouter.delete("/api/v1/user/:userId/station/:stationId", verifyJwt, async (context, next) => {
    Logger.TRAC("[DELETE] /api/v1/user/:userId/station/:stationId");

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
        // delete Station
        let deleteStation = await stationController.deleteStation(userId, stationId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: deleteStation
        };
        return;
    } catch (error) {
        // response
        context.status = 400;
        context.body = {
            result: "failure",
            errors: ["failed to delete Station"],
            data: null
        };
        return;
    }

});

// export 
export { stationRouter };
// import config
import { CONFIG } from "../config";

// import Logger
import { Logger } from "../Logger";

// import router
import * as Router from "koa-router";

// import controller
import { userController } from "../controller/User";
import { verifyJwt } from "../middleware/Auth";

// create new User router
const userRouter = new Router();

// define User routes
userRouter.post("/api/v1/user", verifyJwt, async (context, next) => {
    Logger.TRAC(`[POST] /api/v1/user`);

    // empty User
    let user: any = {};
    // validate input
    if (context.request.body["username"]) {
        user.username = context.request.body["username"];
    }
    if (context.request.body["password"]) {
        user.password = context.request.body["password"];
    }

    try { 
        // create User
        let createUser = await userController.createUser(user);
        // response
        context.status = 201;
        context.body = {
            result: "success",
            errors: null,
            data: createUser
        };
        return;
    }
    catch (error) {
        Logger.ERRO(error);
        // response
        context.status = 500;
        context.body = {
            result: "failure",
            errors: ["failed to create User"],
            data: null
        };
        return;
    }

});
userRouter.get("/api/v1/user", verifyJwt, async (context, next) => {
    Logger.TRAC(`[GET] /api/v1/user`);

    try {
        // read all Users
        let readUsers = await userController.readAllUsers();
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: readUsers
        };
        return;
    } catch (error) {
        Logger.DEBU(error);
        // response
        context.status = 449;
        context.body = {
            result: "failure",
            errors: ["failed to read Users"],
            data: null
        };
        return;
    }

});
userRouter.get("/api/v1/user/:userId", verifyJwt, async (context, next) => {
    Logger.TRAC(`[GET] /api/v1/user/:userId`);

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
        let readUser = await userController.readUser(userId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: readUser
        };
        return;
    } catch (error) {
        // response
        context.status = 500;
        context.body = {
            result: "failure",
            errors: ["failed to read User"],
            data: null
        };
        return;
    }

});
userRouter.patch("/api/v1/user/:userId", verifyJwt, async (context, next) => {
    Logger.TRAC(`[PATCH] /api/v1/user/:userId`);

    // User id
    let userId: number = context.params.userId;
    // validate query parameters
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

    // empty User
    let user: any = {};
    // validate body
    if (context.request.body["password"]) {
        user.password = context.request.body["password"];
    }

    try {
        let updateUser = await userController.updateUser(userId, user);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: updateUser
        };
        return;
    } catch (error) {
        // response
        context.status = 400;
        context.body = {
            result: "failure",
            errors: ["failed to update User"],
            data: null
        };
        return;
    }
});
userRouter.delete("/api/v1/user/:userId", verifyJwt, async (context, next) => {
    Logger.TRAC(`[DELETE] /api/v1/user/:userId`);

    // User id
    let userId: number = context.params.userId;
    // validate query parameters
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
        // delete User
        let deleteUser = await userController.deleteUser(userId);
        // response
        context.status = 200;
        context.body = {
            result: "success",
            errors: [null],
            data: deleteUser
        };
        return;
    } catch (error) {
        // response
        context.status = 400;
        context.body = {
            result: "failure",
            errors: ["failed to delete User"],
            data: null
        };
        return;
    }

});

// export 
export { userRouter };
// import config
import { CONFIG } from "../config";

// import Logger
import { Logger } from "../Logger";

// import router
import * as Router from "koa-router";

// import controller
import { authController } from "../controller/Auth";

// import middleware
import { verifyJwt } from "../middleware/Auth";

// create new Input router
const authRouter = new Router();

authRouter.post("/api/v1/auth/login", async (context, next) => {
    Logger.TRAC(`[POST] /api/v1/auth/login`);

    // empty User
    let user: any = {};
    // validate input TODO:
    if (context.request.body["username"]) {
        user.username = context.request.body["username"];
    }
    if (context.request.body["password"]) {
        user.password = context.request.body["password"];
    }

    try {
        let jwt = await authController.login(user.username, user.password);
        if (jwt) {
            // response
            context.status = 201;
            context.body = {
                result: "success",
                errors: null,
                data: {
                    jwt: jwt.token,
                    payload: jwt.payload
                }
            };
            return;
        }
    }
    catch (error) {
        Logger.ERRO(error);
        // response
        context.status = 500; // TODO: confirm correct http status code
        context.body = {
            result: "failure",
            errors: ["failed to login"],
            data: null
        };
        return;
    }

});
authRouter.post("/api/v1/auth/logout", verifyJwt, async (context, next) => {
    Logger.TRAC("/api/v1/auth/logout");
    // TODO: implement destroying of jwt maybe? REDIS?
    context.status = 200;
    context.body = {
        result: "success",
        errors: null,
        data: null
    };
    return;
});
authRouter.post("/api/v1/auth/signup", async (context, next) => {
    Logger.TRAC(`[POST] /api/v1/auth/signup`);

    // empty User
    let user: any = {};
    // validate input TODO:
    if (context.request.body["username"]) {
        user.username = context.request.body["username"];
    }
    if (context.request.body["password"]) {
        user.password = context.request.body["password"];
    }

    try {
        // create User
        let createUser = await authController.signup(user);
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
            errors: ["failed to signup"],
            data: null
        };
        return;
    }
});
// authRouter.post("/api/v1/auth/verify", async () => {
//
// });

// export
export { authRouter };
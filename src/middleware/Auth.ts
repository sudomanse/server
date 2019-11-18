// import Logger
import { Logger } from "../Logger";

// import JWT
import { JWT } from "../helper/JWT";

// import Koa
import * as Koa from "koa";

const verifyJwt = async (context: Koa.Context, next: () => Promise<any>) => {
    if (context.request.headers.authorization) {
        let jwt = context.request.headers.authorization.toString().replace("Bearer: ", "");
        Logger.TRAC(JSON.stringify(jwt));
        let verifiedResult = await JWT.verify(jwt);
        if (verifiedResult) {
            context.state.jwt = verifiedResult;
            context.state.verified = true;
            return await next();
        }
        else {
            // response
            context.status = 401;
            context.body = {
                result: "failure",
                errors: ["Failed to Authorize"],
                data: null
            };
            return;
        }
    }
    else {
        // response
        context.status = 401;
        context.body = {
            result: "failure",
            errors: ["Authorization header not set"],
            data: null
        };
        return;
    }
};

export { verifyJwt };
// Logger
import { Logger } from "../Logger";

// jsonwebtoken
import {
    sign,
    verify
} from "jsonwebtoken";

class JWT {

    private static privateKey: string;
    private static publicKey: string;
    private static algorithm: string;

    public static init(privateKey, publicKey, algorithm) {
        JWT.privateKey = privateKey;
        JWT.publicKey = publicKey;
        JWT.algorithm = algorithm;
    }
    public static async sign(payload) {
        try {
            let jwt = await sign(payload, JWT.privateKey, {
                algorithm: JWT.algorithm
            });
            if (jwt) {
                return jwt;
            }
            return false;
        }
        catch (error) {
            Logger.ERRO(error); // TODO: fix?
            return false;
        }
    }
    public static async verify(jwtToken) {
        try {
            let verifyResult = await verify(jwtToken.toString(), JWT.privateKey, {
                algorithms: [JWT.algorithm]
            });
            if (verifyResult) {
                return verifyResult;
            }
            return false;
        }
        catch (error) {
            Logger.ERRO(error); // TODO: Fix?
            return false;
        }
    }

}

export { JWT };
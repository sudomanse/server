// config
import { CONFIG } from "../config";

// logger
import { Logger } from "../Logger";

// import typeorm
import { createQueryBuilder } from "typeorm";

// import bcrypt
import { hash, compare } from "bcrypt";

// import jwt
import { sign } from "jsonwebtoken";

// import model
import { User } from "../entity/User";

// import helper
import { JWT } from "../helper/JWT";

// Input controller
const authController = {
    login: async (username, password) => {
        // read user query
        let readUser = await createQueryBuilder()
            .select([
                "user.id",
                "user.username",
                "user.password"
            ])
            .from(User, "user")
            .where("user.username = :username", {
                username: username
            })
            .getOne();
        // TODO: chekc user is verified
        if (! readUser) {
            throw new Error("Failed to read User");
        }
        let passwordMatch = await compare(password, readUser.password);
        if (passwordMatch) {
            let payload = {
                username: readUser.username,
                id: readUser.id
            };
            // TODO: sign jwt token and return
            let jwt = {
                token: await JWT.sign(payload),
                payload: payload
            };
            if (jwt) {
                return jwt
            }
            return false;
        }
        // return
        return false;
    },
    logout: async () => {

    },
    signup: async (user) => {
        // create user query
        let signupUser = await createQueryBuilder("user")
            .insert()
            .into(User)
            .values({
                username: user.username,
                password: await hash(user.password, CONFIG.BCRYPT_SALT_ROUNDS)
            })
            .execute();
        if (! signupUser) {
            throw new Error("Failed to signup");
        }

        // read user query
        let readUser = await createQueryBuilder()
            .select([
                "user.id",
                "user.username"
            ])
            .from(User, "user")
            .where("user.id = :userId", {
                userId: signupUser.raw
            })
            .getOne();
        if (! readUser) {
            throw new Error("Failed to read signup");
        }

        // return
        return readUser;
    },
    verify: async () => {

    }
};

// export
export { authController };
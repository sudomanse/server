// config
import { CONFIG } from "../config";

// logger
import { Logger } from "../Logger";

// import typeorm
import {
    createQueryBuilder
} from "typeorm";

// import bcrypt
import { hash } from "bcrypt";

// import model
import { User } from "../entity/User";

// User controller 
const userController = {
    createUser: async (user) => {

        // create user query
        let createUser = await createQueryBuilder("user")
            .insert()
            .into(User)
            .values({
                username: user.username,
                password: await hash(user.password, CONFIG.BCRYPT_SALT_ROUNDS)
            })
            .execute();
        if (! createUser) {
            throw new Error("Failed to create User");
        }

        // read user query
        let readUser = await createQueryBuilder()
            .select([
                "user.id",
                "user.username"
            ])
            .from(User, "user")
            .where("user.id = :userId", {
                userId: createUser.raw
            })
            .getOne();
        if (! readUser) {
            throw new Error("Failed to read User");
        }

        // return
        return readUser;
    },
    readAllUsers: async () => {
        // read user query
        let readUsers = await createQueryBuilder()
            .select([
                "user.id",
                "user.username"
            ])
            .from(User, "user")
            .orderBy("id")
            .getMany();
        if (! readUsers) {
            throw new Error("Failed to read Users");
        }

        // return
        return readUsers;
    },
    readUser: async (userId) => {
        // read user query
        let readUser = await createQueryBuilder()
            .select([
                "user.id",
                "user.username"
            ])
            .from(User, "user")
            .where("user.id = :userId", {
                userId: userId
            })
            .getOne();
        if (! readUser) {
            throw new Error("Failed to read User");
        }

        // return
        return readUser;
    },
    updateUser: async (userId, user) => {
        // update user
        const updateUser = await createQueryBuilder()
            .update(User)
            .set({
                password: await hash(user.password, CONFIG.BCRYPT_SALT_ROUNDS)
            })
            .where("user.id = :userId", {
                userId: userId
            })
            .execute();
        if (! updateUser) {
            throw new Error("Failed to update User");
        }

        // read user query
        let readUser = await createQueryBuilder()
            .select([
                "user.id",
                "user.username"
            ])
            .from(User, "user")
            .where("user.id = :userId", {
                userId: userId
            })
            .getOne();
        if (! readUser) {
            throw new Error("Failed to read User");
        }

        // return
        return readUser;
    },
    deleteUser: async (userId) => {
        // read user query
        let readUser = await createQueryBuilder()
            .select([
                "user.id",
                "user.username"
            ])
            .from(User, "user")
            .where("user.id = :userId", {
                userId: userId
            })
            .getOne();

        if (! readUser) {
            throw new Error("Failed to read User");
        }

        // delete User query
        let deletedUser = await createQueryBuilder()
            .delete()
            .from(User, "user")
            .where("user.id = :userId", {
                userId: userId
            })
            .execute();
        if (! deletedUser) {
            throw new Error("Failed to delete User");
        }

        // return
        return readUser;
    }
};

// export 
export { userController };
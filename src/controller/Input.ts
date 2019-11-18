// config
import { CONFIG } from "../config";

// logger
import { Logger } from "../Logger";

// import typeorm
import { createQueryBuilder } from "typeorm";

// import uuid
import { v4 } from "uuid";

// import model
import { Input } from "../entity/Input";
import { Station } from "../entity/Station";
import { User } from "../entity/User";
import { Reading } from "../entity/Reading";
import {create} from "domain";

// Input controller 
const inputController = {

    createInput: async (stationId, input) => {
        switch (input.type) {
            case "BASIC":
                return inputController.createInputBasic(stationId, input);
            case "DHT22":
                return inputController.createInputDHT22(stationId, input);
            default:
                throw new Error(`Invalid type provided, cannot create input`);
        }
    },
    readAllInputs: async (userId, stationId) => {
        // read all Inputs belonging to a Station belonging to a User
        const readInputs = await createQueryBuilder("input")
            .leftJoinAndSelect(Station, "station", "station_id = input_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            });
        const readInputsPartial = await createQueryBuilder()
            .select([
                "input_id AS id",
                "input_name AS name",
                "input_description AS description"
            ])
            .from("(" + readInputs.getQuery() +")", "input")
            .setParameters(readInputs.getParameters())
            // .orderBy("id") // TODO: Newly added
            .getRawMany();

        // check Inputs were read
        if (! readInputsPartial) {
            throw new Error("Failed to read Inputs on Station");
        }

        // return
        return readInputsPartial;
    },
    readInput: async (userId, stationId, inputId) => {
        const readInput = await createQueryBuilder("input")
            .leftJoinAndSelect(Station, "station", "station_id = input_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("input.id = :inputId", {
                inputId: inputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            });
        const readInputsPartial = await createQueryBuilder()
            .select([
                "input_id AS id",
                "input_name AS name",
                "input_description AS description",
                "input_mqttAddress AS mqttAddress",
                "input_mqttTopic AS mqttTopic",
                "input_mqttWifiSsid AS mqttWifiSsid",
                "input_mqttWifiPassword AS mqttWifiPassword",
            ])
            .from("(" + readInput.getQuery() +")", "input")
            .setParameters(readInput.getParameters())
            .getRawOne();

        if (! readInputsPartial) {
            throw new Error("Input not read");
        }

        return readInputsPartial;
    },
    updateInput: async (userId, stationId, inputId, input) => {
        const verifyInput = await createQueryBuilder("input")
            .leftJoinAndSelect(Station, "station", "station_id = input_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("input.id = :inputId", {
                inputId: inputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            })
            .getOne();

        if (! verifyInput) {
            throw new Error("No Input found with that User id and Station id and Input id");
        }

        const updateInput = await createQueryBuilder()
            .update(Input)
            .set({
                description: input.description
            })
            .where("input.id = :inputId", {
                inputId: inputId
            })
            .execute();

        if (! updateInput) {
            throw new Error("Failed to update Input");
        }

        const readInput = await createQueryBuilder("input")
            .leftJoinAndSelect(Station, "station", "station_id = input_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("input.id = :inputId", {
                inputId: inputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            });
        const readInputPartial = await createQueryBuilder()
            .select([
                "input_id AS id",
                "input_name AS name",
                "input_description AS description"
            ])
            .from("(" + readInput.getQuery() +")", "input")
            .setParameters(readInput.getParameters())
            .getRawOne();

        if (! readInputPartial) {
            throw new Error("Input not read");
        }

        return readInputPartial;
    },
    deleteInput: async (userId, stationId, inputId) => {
        const verifyInput = await createQueryBuilder("input")
            .leftJoinAndSelect(Station, "station", "station_id = input_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("input.id = :inputId", {
                inputId: inputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            })
            .getOne();

        if (! verifyInput) {
            throw new Error("No Input found with that User id and Station id and Input id");
        }

        const deleteInput = await createQueryBuilder()
            .delete()
            .from(Input, "input")
            .where("input.id = :inputId", {
                inputId: inputId
            })
            .execute();

        if (! deleteInput) {
            throw new Error("Failed to delete Station");
        }

        // return
        return verifyInput;
    },

    query: async (userId, stationId, inputId, query) => {
        const readInput = await createQueryBuilder("input")
            .leftJoinAndSelect(Station, "station", "station_id = input_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("input.id = :inputId", {
                inputId: inputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            })
            // .orderBy("id", "DESC")
            .getOne();
        if (! readInput) {
            throw new Error("Failed to read input");
        }
        const readInputsPartial = await createQueryBuilder()
            .select([
                "reading.reading AS reading",
                "reading.time AS time"
            ])
            .from(Reading, "reading")
            .where("reading.inputId = :inputId", {
                inputId: readInput["id"]
            })
            .orderBy("id", "DESC")
            .limit(query.limit || 100)
            .getRawMany();
        if (! readInputsPartial) {
            throw new Error("Failed to read inputs partial");
        }
        return readInputsPartial;
    },
    getConfig: async (userId, stationId, inputId) => {
        const readOutput = await createQueryBuilder("input")
            .leftJoinAndSelect(Station, "station", "station_id = input_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("input.id = :inputId", {
                inputId: inputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            });
        const readInputsPartial = await createQueryBuilder()
            .select([
                "input_id AS id",
                "input_name AS name",
                "input_description AS description",
                "input_keys AS keys",
                "input_code AS code",
                "input_mqttAddress AS mqttAddress",
                "input_mqttTopic AS mqttTopic",
                "input_mqttWifiSsid AS mqttWifiSsid",
                "input_mqttWifiPassword AS mqttWifiPassword",
            ])
            .from("(" + readOutput.getQuery() +")", "input")
            .setParameters(readOutput.getParameters())
            .getRawOne();
        // Logger.TRAC(JSON.stringify(readInputsPartial));

        if (! readInputsPartial) {
            throw new Error("Input not read");
        }

        return readInputsPartial;
    },

    createInputDHT22: async (stationId, input) => {
        let readStation = await createQueryBuilder()
            .select([
                "station.name",
                "station.description",
                "station.id"
            ])
            .from(Station, "station")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .getOne();
        // check Station read
        if(! readStation) {
            throw new Error("Failed to load Station to link to Input");
        }

        let createdInputTemperature = await createQueryBuilder("input")
            .insert()
            .into(Input)
            .values({
                name: `${input.name} [T]`,
                description: `${input.description} Temperature`,
                type: input.type,
                code: await v4(),
                keys: await v4(),
                station: readStation,

                mqttAddress: input.mqttAddress,
                mqttTopic: input.mqttTopic,
                mqttWifiSsid: input.mqttWifiSsid,
                mqttWifiPassword: input.mqttWifiPassword
            })
            .execute();
        let createdInputHumidity = await createQueryBuilder("input")
            .insert()
            .into(Input)
            .values({
                name: `${input.name} [H]`,
                description: `${input.description} Humidity`,
                type: input.type,
                code: await v4(),
                keys: await v4(),
                station: readStation,

                mqttAddress: input.mqttAddress,
                mqttTopic: input.mqttTopic,
                mqttWifiSsid: input.mqttWifiSsid,
                mqttWifiPassword: input.mqttWifiPassword
            })
            .execute();

        // check Input was created
        if ((! createdInputTemperature) || (! createdInputHumidity)) {
            throw new Error("Failed to create Inputs");
        }

        // read Input
        const readInputTemperature = await createQueryBuilder()
            .select([
                "input.id",
                "input.name",
                "input.description",
                "input.code"
            ])
            .from(Input, "input")
            .where("input.id = :inputId", {
                inputId: createdInputTemperature.raw
            })
            .getOne();
        const readInputHumidity = await createQueryBuilder()
            .select([
                "input.id",
                "input.name",
                "input.description",
                "input.code"
            ])
            .from(Input, "input")
            .where("input.id = :inputId", {
                inputId: createdInputHumidity.raw
            })
            .getOne();

        if ((! readInputTemperature) || (! readInputHumidity)) {
            throw new Error("Failed to read Inputs");
        }

        return [readInputTemperature, readInputTemperature];
    },
    createInputBasic: async (stationId, input) => {
        let readStation = await createQueryBuilder()
            .select([
                "station.name",
                "station.description",
                "station.id"
            ])
            .from(Station, "station")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .getOne();
        // check Station read
        if(! readStation) {
            throw new Error("Failed to load Station to link to Input");
        }

        let createdInput = await createQueryBuilder("input")
            .insert()
            .into(Input)
            .values({
                name: input.name,
                description: input.description,
                type: input.type,
                code: await v4(),
                keys: await v4(),
                station: readStation,

                mqttAddress: input.mqttAddress,
                mqttTopic: input.mqttTopic,
                mqttWifiSsid: input.mqttWifiSsid,
                mqttWifiPassword: input.mqttWifiPassword
            })
            .execute();

        // check Input was created
        if (! createdInput) {
            throw new Error("Failed to create Input");
        }

        // read Input
        const readInput = await createQueryBuilder()
            .select([
                "input.id",
                "input.name",
                "input.description",
                "input.code"
            ])
            .from(Input, "input")
            .where("input.id = :inputId", {
                inputId: createdInput.raw
            })
            .getOne();

        if (! readInput) {
            throw new Error("Input not read after creation");
        }

        return readInput;
    }
};

// export 
export { inputController };
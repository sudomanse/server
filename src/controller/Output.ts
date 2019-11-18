// config
import { CONFIG } from "../config";

// logger
import { Logger } from "../Logger";

// import typeorm
import {
    createQueryBuilder
} from "typeorm";

// import uuid
import { v4 } from "uuid";

// import model
import { Output } from "../entity/Output";
import { Station } from "../entity/Station";
import { User } from "../entity/User";

// import mqtt
import { MqttClient } from "../helper/MqttClient";

// Output controller
const outputController = {
    createOutput: async (stationId, output) => {
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
            throw new Error("Failed to load Station to link to Output");
        }

        let createdOutput = await createQueryBuilder("output")
            .insert()
            .into(Output)
            .values({
                name: output.name,
                description: output.description,
                state: output.state,
                code: await v4(),
                keys: await v4(),
                station: readStation,

                mqttAddress: output.mqttAddress,
                mqttTopic: output.mqttTopic,
                mqttWifiSsid: output.mqttWifiSsid,
                mqttWifiPassword: output.mqttWifiPassword
            })
            .execute();

        // check Output was created
        if (! createdOutput) {
            throw new Error("Failed to create Output");
        }

        // read Output
        const readOutput = await createQueryBuilder()
            .select([
                "output.id",
                "output.name",
                "output.description",
                "output.code"
            ])
            .from(Output, "output")
            .where("output.id = :outputId", {
                outputId: createdOutput.raw
            })
            .getOne();

        if (! readOutput) {
            throw new Error("Output not read after creation");
        }

        return readOutput;
    },
    readAllOutputs: async (userId, stationId) => {
        // read all Outputs belonging to a Station belonging to a User
        const readOutputs = await createQueryBuilder("output")
            .leftJoinAndSelect(Station, "station", "station_id = output_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            });
        const readOutputsPartial = await createQueryBuilder()
            .select([
                "output_id AS id",
                "output_name AS name",
                "output_description AS description"
            ])
            .from("(" + readOutputs.getQuery() +")", "output")
            .setParameters(readOutputs.getParameters())
            .getRawMany();

        // check Outputs were read
        if (! readOutputsPartial) {
            throw new Error("Failed to read Outputs on Station");
        }

        // return
        return readOutputsPartial;
    },
    readOutput: async (userId, stationId, outputId) => {
        const readOutput = await createQueryBuilder("output")
            .leftJoinAndSelect(Station, "station", "station_id = output_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("output.id = :outputId", {
                outputId: outputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            });
        const readOutputsPartial = await createQueryBuilder()
            .select([
                "output_id AS id",
                "output_name AS name",
                "output_description AS description",
                "output_mqttAddress AS mqttAddress",
                "output_mqttTopic AS mqttTopic",
                "output_mqttWifiSsid AS mqttWifiSsid",
                "output_mqttWifiPassword AS mqttWifiPassword",
            ])
            .from("(" + readOutput.getQuery() +")", "output")
            .setParameters(readOutput.getParameters())
            .getRawOne();

        if (! readOutputsPartial) {
            throw new Error("Output not read");
        }

        return readOutputsPartial;
    },
    updateOutput: async (userId, stationId, outputId, output) => {
        const verifyOutput = await createQueryBuilder("output")
            .leftJoinAndSelect(Station, "station", "station_id = output_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("output.id = :outputId", {
                outputId: outputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            })
            .getOne();

        if (! verifyOutput) {
            throw new Error("No Output found with that User id, Station id and Output id");
        }

        const updateOutput = await createQueryBuilder()
            .update(Output)
            .set({
                description: output.description
            })
            .where("output.id = :outputId", {
                outputId: outputId
            })
            .execute();

        if (! updateOutput) {
            throw new Error("Failed to update Output");
        }

        const readOutput = await createQueryBuilder("output")
            .leftJoinAndSelect(Station, "station", "station_id = output_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("output.id = :outputId", {
                outputId: outputId
            })
            .andWhere("user.id = :userId", {
                userId: userId // TODO: ??
            });
        const readOutputPartial = await createQueryBuilder()
            .select([
                "output_id AS id",
                "output_name AS name",
                "output_description AS description"
            ])
            .from("(" + readOutput.getQuery() +")", "output")
            .setParameters(readOutput.getParameters())
            .getRawOne();

        if (! readOutputPartial) {
            throw new Error("Output not read");
        }

        return readOutputPartial;
    },
    deleteOutput: async (userId, stationId, outputId) => {
        const verifyOutput = await createQueryBuilder("output")
            .leftJoinAndSelect(Station, "station", "station_id = output_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("output.id = :outputId", {
                outputId: outputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            })
            .getOne();

        if (! verifyOutput) {
            throw new Error("No Output found with that User id and Station id and Output id");
        }

        const deleteOutput = await createQueryBuilder()
            .delete()
            .from(Output, "output")
            .where("output.id = :outputId", {
                outputId: outputId
            })
            .execute();

        if (! deleteOutput) {
            throw new Error("Failed to delete Station");
        }

        // return
        return verifyOutput;
    },

    controlOutput: async (userId, stationId, outputId, state) => {
        const verifyOutput = await createQueryBuilder("output")
            .leftJoinAndSelect(Station, "station", "station_id = output_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("output.id = :outputId", {
                outputId: outputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            })
            .getOne();

        if (! verifyOutput) {
            throw new Error("No Output found with that User id and Station id and Output id");
        }

        const controlOutput = await createQueryBuilder()
            .update(Output)
            .set({
                state: state
            })
            .where("output.id = :outputId", {
                outputId: outputId
            })
            .execute();

        const readOutput = await createQueryBuilder()
            .select([
                "output.id",
                "output.name",
                "output.description",
                "output.code",
                "output.keys",
                "output.state"
            ])
            .from(Output, "output")
            .where("output.id = :outputId", {
                outputId: outputId
            })
            .getOne();

        if (! readOutput) {
            throw new Error("failed to read Output controlled");
        }

        await MqttClient.sendMessage(`${CONFIG.MQTT_TOPIC_OUTPUT}/${readOutput.code}/${readOutput.keys}`, JSON.stringify(readOutput.state));

        return readOutput;
    },
    getConfig: async (userId, stationId, outputId) => {
        const readOutput = await createQueryBuilder("output")
            .leftJoinAndSelect(Station, "station", "station_id = output_stationId")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .andWhere("output.id = :outputId", {
                outputId: outputId
            })
            .andWhere("user.id = :userId", {
                userId: userId
            });
        const readOutputsPartial = await createQueryBuilder()
            .select([
                "output_id AS id",
                "output_name AS name",
                "output_description AS description",
                "output_keys AS keys",
                "output_code AS code",
                "output_mqttAddress AS mqttAddress",
                "output_mqttTopic AS mqttTopic",
                "output_mqttWifiSsid AS mqttWifiSsid",
                "output_mqttWifiPassword AS mqttWifiPassword",
            ])
            .from("(" + readOutput.getQuery() +")", "output")
            .setParameters(readOutput.getParameters())
            .getRawOne();
        Logger.TRAC(JSON.stringify(readOutputsPartial));

        if (! readOutputsPartial) {
            throw new Error("Output not read");
        }

        return readOutputsPartial;
    }
};

// export
export { outputController };
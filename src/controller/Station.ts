// config
import { CONFIG } from "../config";

// logger
import { Logger } from "../Logger";

// import typeorm
import {
    createQueryBuilder,
    getManager
} from "typeorm";

// import uuid
import { v4 } from "uuid";

// import model
import { User } from "../entity/User";
import { Station } from "../entity/Station";

// Station controller 
const stationController = {
    createStation: async (userId, station) => {

        // read User
        const readUser = await createQueryBuilder()
            .select([
                "user.username",
                "user.id"
            ])
            .from(User, "user")
            .where("user.id = :userId", {
                userId: userId
            })
            .getOne();
        // check User read
        if (! readUser) {
            throw new Error('Failed to load User to link to Station');
        }

        // create Station
        const createdStation = await createQueryBuilder("station")
            .insert()
            .into(Station)
            .values({
                name: station.name,
                description: station.description,
                code: await v4(),
                owner: readUser,
                users: [readUser]
            })
            .execute();

        // check Station was created
        if (! createdStation) {
            throw new Error("Station not created");
        }

        // read Station
        const readStation = await createQueryBuilder()
            .select([
                "station.id",
                "station.name",
                "station.description"
            ])
            .from(Station, "station")
            .where("station.id = :stationId", {
                stationId: createdStation.raw
            })
            .getOne();

        // check Station was read
        if (! readStation) {
            throw new Error("Station not read after creation");
        }

        // return
        return readStation;
    },
    readAllStationsOld: async (userId) => {
        // read all Stations belonging to user
        const readStations = await createQueryBuilder("station")
            .leftJoinAndSelect(User, "user", "user.id = station.ownerId")
            .where("user.id = :userId", {
                userId: userId
            });

        Logger.TRAC(JSON.stringify(await readStations.getMany(), null, 2));
        // .getMany();

        const readStationPartial = await createQueryBuilder()
            .select([
                "station_id",
                "station_name",
                "station_description"
            ])
            .from("(" + readStations.getQuery() +")", "station")
            .setParameters(readStations.getParameters())
            .getRawMany();

        // check Stations were read
        if (! readStationPartial) {
            throw new Error("Stations not read");
        }
        // return
        return readStationPartial;
    },
    readAllStations: async (userId) => {
        // read all Stations belonging to user
        const readStations = await createQueryBuilder("station")
            .leftJoinAndSelect(User, "user", "user_id = station_ownerId")
            .where("user_id = :userId", {
                userId: userId
            });
        const readStationPartial = await createQueryBuilder()
            .select([
                "station_id AS id",
                "station_name AS name",
                "station_description AS description"
            ])
            .from("(" + readStations.getQuery() +")", "station")
            .setParameters(readStations.getParameters())
            .getRawMany();

        // check Stations were read
        if (! readStationPartial) {
            throw new Error("Stations not read");
        }

        // return
        return readStationPartial;
    },
    readStation: async (userId, stationId) => {

        // read all Stations belonging to user
        const readStation = await createQueryBuilder("station")
            .leftJoinAndSelect(User, "user", "user.id = station.ownerId")
            .where("user.id = :userId", {
                userId: userId
            }).andWhere("station.id = :stationId", {
                stationId: stationId
            });
            // .getOne();

        const readStationPartial = await createQueryBuilder()
            .select([
                "station_id AS id",
                "station_name AS name",
                "station_description AS description",
                "station_created AS created",
                "station_modified AS modified"
            ])
            .from("(" + readStation.getQuery() +")", "station")
            .setParameters(readStation.getParameters())
            .getRawOne();

        // check Stations were read
        if (! readStationPartial) {
            throw new Error("Station not read");
        }
        // return
        return readStationPartial;
    },
    updateStation: async (userId, stationId, station) => {
        // verify user and station
        const verifyStation = await createQueryBuilder("station")
            .leftJoinAndSelect(User, "user", "user.id = station.ownerId")
            .where("user.id = :userId", {
                userId: userId
            })
            .andWhere("station.id = :stationId", {
                stationId: stationId
            })
            .getOne();

        if (! verifyStation) {
            throw new Error("No Station found with that User id and Station id");
        }

        // update station
        const updateStation = await createQueryBuilder()
            .update(Station)
            .set({
                description: station.description
            })
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .execute();

        if (! updateStation) {
            throw new Error("Failed to update Station");
        }

        // read Station
        const readStation = await createQueryBuilder("station")
            .leftJoinAndSelect(User, "user", "user.id = station.ownerId")
            .where("user.id = :userId", {
                userId: userId
            })
            .andWhere("station.id = :stationId", {
                stationId: stationId
            });

        const readStationPartial = await createQueryBuilder()
            .select([
                "station_id AS id",
                "station_name AS name",
                "station_description AS description"
            ])
            .from("(" + readStation.getQuery() +")", "station")
            .setParameters(readStation.getParameters())
            .getRawOne();

        if (! readStationPartial) {
            throw new Error("Station not read");
        }

        return readStationPartial;
    },
    deleteStation: async (userId, stationId) => {
        // verify user and station
        const verifyStation = await createQueryBuilder("station")
            .leftJoinAndSelect(User, "user", "user.id = station.ownerId")
            .where("user.id = :userId", {
                userId: userId
            })
            .andWhere("station.id = :stationId", {
                stationId: stationId
            });

        const verifyStationPartial = await createQueryBuilder()
            .select([
                "station_id AS id",
                "station_name AS name",
                "station_description AS description"
            ])
            .from("(" + verifyStation.getQuery() +")", "station")
            .setParameters(verifyStation.getParameters())
            .getRawOne();

        if (! verifyStationPartial) {
            throw new Error("No Station found with that User id and Station id");
        }

        const deleteStation = await createQueryBuilder()
            .delete()
            .from(Station, "station")
            .where("station.id = :stationId", {
                stationId: stationId
            })
            .execute();

        if (! deleteStation) {
            throw new Error("Failed to delete Station");
        }

        // return
        return verifyStationPartial;
    }
};

// export 
export { stationController };
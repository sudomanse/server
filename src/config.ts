// import dotenv
import * as dotenv from "dotenv";

// load env vars
dotenv.config();

// define CONFIG variables for code completion
const CONFIG = {
    SERVER_DEBUG: parseInt(process.env.SERVER_DEBUG),
    SERVER_PORT: parseInt(process.env.SERVER_PORT),

    BODYPARSER_JSON_LIMIT: process.env.BODYPARSER_JSON_LIMIT,

    JWT_PRIVATE_KEY_LOCATION: process.env.JWT_PRIVATE_KEY_LOCATION,
    JWT_PUBLIC_KEY_LOCATION: process.env.JWT_PUBLIC_KEY_LOCATION,

    BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS),

    MQTT_CONNECTION_STRING: process.env.MQTT_CONNECT_STRING,
    MQTT_TOPIC_INPUT: process.env.MQTT_TOPIC_INPUT,
    MQTT_TOPIC_OUTPUT: process.env.MQTT_TOPIC_OUTPUT
};

// export
export { CONFIG };
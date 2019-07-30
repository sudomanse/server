// import dotenv
import * as dotenv from "dotenv";

// load env vars
dotenv.config();

// define CONFIG variables for code completion
const CONFIG = {
    // debug level
    DEBUG: parseInt(process.env.DEBUG),
    // port for app to run on
    PORT: parseInt(process.env.PORT),
    // max size of json to receive
    JSON_LIMIT: process.env.JSON_LIMIT
};

// export
export { CONFIG };
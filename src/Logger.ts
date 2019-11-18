// import debug level
import { CONFIG } from "./config";

// constant debug levels
const LEVEL_TRACE = 0;
const LEVEL_DEBUG = 10;
const LEVEL_INFO = 20;
const LEVEL_WARNING = 30;
const LEVEL_ERROR = 40;
const LEVEL_CRITITCAL = 50;

// Logger
class Logger {

    public static TRAC(message) {
        if (CONFIG.SERVER_DEBUG <= LEVEL_TRACE) {
            console.log(`[TRAC] ${message}`);
        }
    }
    public static DEBU(message) {
        if (CONFIG.SERVER_DEBUG <= LEVEL_DEBUG) {
            console.log(`[DEBU] ${message}`);
        }
    }
    public static INFO(message) {
        if (CONFIG.SERVER_DEBUG <= LEVEL_INFO) {
            console.log(`[INFO] ${message}`);
        }
    }
    public static WARN(message) {
        if (CONFIG.SERVER_DEBUG <= LEVEL_WARNING) {
            console.log(`[WARN] ${message}`);
        }
    }
    public static ERRO(message) {
        if (CONFIG.SERVER_DEBUG <= LEVEL_ERROR) {
            console.log(`[ERRO] ${message}`);
        }
    }
    public static CRIT(message) {
        if (CONFIG.SERVER_DEBUG <= LEVEL_CRITITCAL) {
            console.log(`[CRIT] ${message}`);
        }
    }

}

// export
export { Logger };
// import CONFIG
import { CONFIG } from "../config";

// import Logger
import { Logger } from "../Logger";

// import async-mwtt
import * as mqtt from "async-mqtt";

// import controller
import { readingController } from "../controller/Reading";

class MqttClient {
    private static isConnected: boolean = false;
    private static mqttClient;

    public static async  start() {
        await MqttClient.connect();
    }

    public static async connect() {
        try {
            MqttClient.mqttClient = await mqtt.connect(CONFIG.MQTT_CONNECTION_STRING);
            MqttClient.mqttClient.on("connect", async function() {
                Logger.INFO("MQTT connected");
                MqttClient.isConnected = true;
                await MqttClient.subscribe();
            });
            MqttClient.mqttClient.on("disconnect", async function() {
                Logger.INFO("MQTT disconnect");
                MqttClient.isConnected = false;
            });
        }
        catch (error) {
            Logger.ERRO("Failed to reconnect MQTT");
            MqttClient.isConnected = false;
        }
    }
    public static async subscribe() {
        try {
            await MqttClient.mqttClient.unsubscribe(`${CONFIG.MQTT_TOPIC_INPUT}/#`);
            await MqttClient.mqttClient.subscribe(`${CONFIG.MQTT_TOPIC_INPUT}/#`);
            MqttClient.mqttClient.on("message", async (topic: string, message: string) => {
                let splitTopic: string[] = topic.split("/");
                if (splitTopic.length >= 3) {
                    try {
                        let messageJson = JSON.parse(message.toString());
                        await readingController.mqttReading(splitTopic[1], splitTopic[2], messageJson);
                        Logger.DEBU(`Input data captured`);
                    } catch (error) {
                        Logger.ERRO("Failed to capture mqttReading()");
                        Logger.ERRO(`${splitTopic[1]} / ${splitTopic[2]}`);
                    }
                }
                else {
                    Logger.INFO("MQTT message wrong format");
                }
            });

        }
        catch (error) {
            Logger.ERRO('Failed to subscribe() mqttClient');
        }
    }
    public static async sendMessage(topic, message) {
        if (MqttClient.isConnected) {
            await MqttClient.mqttClient.publish(topic, message);
        }
        else {
            Logger.ERRO("Failed to sendMessage(), mqttClient was not connected");
            await MqttClient.connect();
        }
    };
}

export { MqttClient };
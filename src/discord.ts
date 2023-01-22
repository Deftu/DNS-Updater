import config from "./config";
import axios from "axios";

export async function send(title: string, message: string) {
    await axios.post(config.discord.webhookUrl, {
        embeds: [
            {
                title,
                description: message,
                timestamp: new Date().toISOString()
            }
        ]
    });
}

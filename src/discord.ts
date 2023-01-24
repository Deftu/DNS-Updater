import config from "./config";
import axios from "axios";

export async function send(title: string, message: string) {
    await axios.post(config.discord.url, {
        embeds: [
            {
                title,
                description: message,
                timestamp: new Date().toISOString()
            }
        ]
    });
}

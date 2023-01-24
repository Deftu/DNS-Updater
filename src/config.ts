// read dotenv
require("dotenv").config();

// import fs
import * as fs from "fs";

export type Domain = {
    name: string;
    recordNames: string[];
}

export type Discord = {
    url: string;
}

type Config = {
    apiToken: string;
    domains: Domain[];
    discord: Discord;
};

const defaultConfig: Config = {
    apiToken: process.env.CLOUDFLARE_API_KEY || "",
    domains: [],
    discord: {
        url: process.env.DISCORD_WEBHOOK_URL || ""
    }
};

function initializeConfig(): Config {
    // get the config file path
    const configPath = process.env.CONFIG_PATH || "config.json";

    // check if the config file exists
    if (fs.existsSync(configPath)) {
        // Parse the config file
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as Config;

        // Fallback to default config for missing values, including nested objects, otherwise use the config file value
        return {
            ...defaultConfig,
            ...config,
            domains: [
                ...defaultConfig.domains,
                ...config.domains
            ],
            discord: {
                ...defaultConfig.discord,
                ...config.discord
            }
        };
    } else {
        // Write the default config, since it doesn't exist, then return the default config
        fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 4), "utf-8");
        return defaultConfig;
    }
}

const config = initializeConfig();
export default config;

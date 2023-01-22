import axios from "axios";
import fs from "fs";
const regex = /(\d{1,3}\.){3}\d{1,3}/;

export async function getIp(): Promise<string | null> {
    const response = await axios.get("https://api.ipify.org");
    const value = response.data;
    if (regex.test(value)) {
        return value;
    } else return null;
}

export async function getLastIp(): Promise<string | null> {
    try {
        const data = fs.readFileSync("ip.txt", "utf8");
        return data;
    } catch (e) {
        return null;
    }
}

export async function setLastIp(ip: string): Promise<void> {
    fs.writeFileSync("ip.txt", ip);
}

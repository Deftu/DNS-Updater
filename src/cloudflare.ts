import axios, {
    type AxiosRequestConfig
} from "axios";
import config from "./config";
const baseUrl = "https://api.cloudflare.com/client/v4";

const rateLimit = 1200 / 5 / 60 / 1000;
let lastRequest = 0;
let requestCount = 0;

export async function makeRequest(path: string, options?: AxiosRequestConfig | undefined): Promise<any> {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequest;
    if (timeSinceLastRequest < rateLimit) await new Promise(resolve => setTimeout(resolve, rateLimit - timeSinceLastRequest));

    lastRequest = Date.now();
    requestCount++;
    try {
        const response = await axios(`${baseUrl}${path}`, {
            ...options,
            headers: {
                "Authorization": `Bearer ${config.apiKey}`,
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (e: any) {
        throw e;
    }
}

export type Zone = {
    id: string;
    name: string;
    content: string;
    type: string;
    ttl: number;
}

export async function getDnsRecords(zoneId: string): Promise<Zone[]> {
    try {
        const response = await makeRequest(`/zones/${zoneId}/dns_records`);
        return response.result as Zone[];
    } catch (e) {
        console.log(e);
        return [];
    }
}

export async function updateDnsRecord(zoneId: string, recordId: string, record: Zone): Promise<any> {
    // @ts-ignore
    const response = await makeRequest(`/zones/${zoneId}/dns_records/${recordId}`, {
        method: "PUT",
        data: {
            ...record
        }
    });
    return response.result as Zone;
}

import config from "./config";
import { getDnsRecords, updateDnsRecord } from "./cloudflare";
import { getIp, getLastIp, setLastIp } from "./ip";
import { send as sendEmbed } from "./discord";

async function execute() {
    const ip = await getIp();
    if (!ip) {
        console.log("Could not get IP address");
        return;
    }

    const lastIp = await getLastIp();
    if (lastIp === ip) {
        console.log("IP address has not changed");
        return;
    }

    for (const domain of config.domains) {
        const records = await getDnsRecords(domain.zoneId);
        for (const name of domain.names) {
            const record = records.find(record => record.name === name);
            if (record) {
                if (record.content !== ip) {
                    console.log(`Updating ${name} to ${ip}`);
                    await updateDnsRecord(domain.zoneId, record.id, record);
                    await sendEmbed(`DNS Update - ${record.name}`, `The IP address for **${name}** has changed to **${ip}**.`);
                }
            } else {
                console.log(`Could not find record for ${name}`);
                await sendEmbed(`DNS Update - ${name}`, `Could not find a record for **${name}**.`);
            }
        }
    }

    await setLastIp(ip);
}

execute();

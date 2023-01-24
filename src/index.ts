import config from "./config";
import { getZoneId, getDnsRecords, updateDnsRecord } from "./cloudflare";
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
        const zoneId = await getZoneId(domain.name);
        if (!zoneId) {
            console.log(`Could not find zone for ${domain.name}`);
            await sendEmbed(`DNS Update - ${domain.name}`, `Could not find a zone for **${domain.name}**.`);
            continue;
        }

        const records = await getDnsRecords(zoneId);
        for (const name of domain.recordNames) {
            const record = records.find(record => record.name === name);
            if (record) {
                if (record.content !== ip) {
                    console.log(`Updating ${name} to ${ip}`);
                    const newRecord = {
                        ...record,
                        content: ip
                    };
                    await updateDnsRecord(zoneId, record.id, newRecord);
                    await sendEmbed(`DNS Update - ${record.name}`, `The IP address for **${name}** has changed from **${lastIp}** to **${ip}**.`);
                } else {
                    console.log(`Record for ${name} is already up to date`);
                    await sendEmbed(`DNS Update - ${record.name}`, `The IP address for **${name}** is already up to date.`);
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

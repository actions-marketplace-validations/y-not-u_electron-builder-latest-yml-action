const core = require('@actions/core');
const github = require('@actions/github');
import {stat, writeFileSync} from 'fs';

async function run() {
    try {
        const algorithm = core.getInput('hash-type');
        const artifact = core.getInput('artifact');
        const stagingPercentage = core.getInput('staging-percentage');
        const version = core.getInput('version');

        const fileStats = await stat(artifact);
        if (fileStats.isDirectory()) {
            core.debug(
                `Removing ${artifact} because it is a directory`
            )
            core.setFailed('No artifact found');
        }
        core.debug(`Artifact is ${artifact}`);

        const hash = await hasha.fromFile(artifact, {algorithm});
        const result = {
            version,
            path: artifact,
            stagingPercentage,
        }
        result[algorithm] = hash;
        writeFileSync("latest.yml", JSON.stringify(result), {encoding: "utf8"});
    } catch (error) {
        core.setFailed(error.message);
    }
}
 
run();

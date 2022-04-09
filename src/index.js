const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const hasha = require('hasha');

async function run() {
    try {
        const algorithm = core.getInput('hash-type');
        const artifact = core.getInput('artifact');
        const stagingPercentage = core.getInput('staging-percentage');
        const version = core.getInput('version');

        core.debug(`Artifact is ${artifact}`);

        const hash = await hasha.fromFile(artifact, {algorithm});
        const result = {
            version,
            path: artifact,
            stagingPercentage,
        }
        result[algorithm] = hash;
        fs.writeFileSync("latest.yml", JSON.stringify(result), {encoding: "utf8"});
    } catch (error) {
        core.setFailed(error.message);
    }
}
 
run();

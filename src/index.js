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
        const yamlFile = core.getInput('yml-file');

        core.info(`Artifact is ${artifact}`);

        const hash = await hasha.fromFile(artifact, {algorithm});

        fs.writeFileSync(yamlFile, `version: ${version}\n`, {encoding: "utf8", flag: "a"});
        fs.writeFileSync(yamlFile, `path: ${artifact}\n`, {encoding: "utf8", flag: "a"});
        fs.writeFileSync(yamlFile, `${algorithm}: ${hash}\n`, {encoding: "utf8", flag: "a"});
        fs.writeFileSync(yamlFile, `stagingPercentage: ${stagingPercentage}\n`, {encoding: "utf8", flag: "a"});
    } catch (error) {
        core.setFailed(error.message);
    }
}
 
run();

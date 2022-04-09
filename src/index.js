const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('glob')
const fs = require('fs');
const hasha = require('hasha');

async function run() {
    try {
        const algorithm = core.getInput('hash-type');
        const artifact = core.getInput('artifact');
        const stagingPercentage = core.getInput('staging-percentage');
        const version = core.getInput('version');
        const yamlFile = core.getInput('yml-file');

        const files = await glob.sync(artifact);
        if (files.length === 0) {
            core.setFailed(`No file found`);
            return;
        }
        const file = files[0]
        const filename = file.split(/(\\|\/)/g).pop()

        core.info(`Artifact is ${filename}`);

        const hash = await hasha.fromFile(file, {algorithm});

        fs.writeFileSync(yamlFile, `version: ${version}\n`, {encoding: "utf8", flag: "a"});
        fs.writeFileSync(yamlFile, `path: ${filename}\n`, {encoding: "utf8", flag: "a"});
        fs.writeFileSync(yamlFile, `${algorithm}: ${hash}\n`, {encoding: "utf8", flag: "a"});
        fs.writeFileSync(yamlFile, `stagingPercentage: ${stagingPercentage}\n`, {encoding: "utf8", flag: "a"});
    } catch (error) {
        core.setFailed(error.message);
    }
}
 
run();

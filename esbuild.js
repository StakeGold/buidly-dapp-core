/* eslint-disable @typescript-eslint/no-var-requires */
const executeBuildCommand = require('./executeBuildCommand');

const cjsBuild = executeBuildCommand('cjs');
const esmBuild = executeBuildCommand('esm');

cjsBuild();
esmBuild();

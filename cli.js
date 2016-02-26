#!/usr/bin/env node

const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));
const prefix = argv._[0];
const options = {
  dev: argv.dev || argv.d
};
if (!prefix || argv['?'] || argv['h'] || argv['help']) {
  fs.createReadStream('./usage.txt').pipe(process.stdout);
  return;
}

require('./index')(prefix, options);

#!/usr/bin/env node

const fs = require('fs');
const utils = require('js-utils');

const UTF_8 = 'utf-8';

const promiseReadFile = utils.asyncifyCallback(fs.readFile);

function displaySuccess(output) {
  console.log(output);
}

function displayError(error) {
  if (error instanceof Error) {
    console.error(error.stack);
  } else {
    console.error(error);
  }
  process.exit(1);
}

new Promise((resolve, reject) => {
  Promise.all(process.argv.slice(2).map(json => promiseReadFile(json, UTF_8)))
    .then(files => {
      const concat = files.reduce((p, c) => Object.assign(p, JSON.parse(c)), {});
      resolve(JSON.stringify(concat, null, 2));
    })
    .catch(reject);
})
  .then(displaySuccess)
  .catch(displayError);

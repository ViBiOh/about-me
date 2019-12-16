#!/usr/bin/env node

const fs = require('fs');
const utils = require('js-utils');
const dateFns = require('date-fns');
const dateFnsLocale = require('date-fns/locale');

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

      // computing date delta
      concat.work.forEach(work => {
        if (work.startDate) {
          try {
            const startDate = new Date(work.startDate);
            const endDate = work.endDate ? new Date(work.endDate) : new Date();

            work.duration = dateFns.formatDistance(startDate, endDate, { locale: dateFnsLocale.fr });
          } catch (e) {
            console.error(e);
          }
        }
      });

      resolve(JSON.stringify(concat, null, 2));
    })
    .catch(reject);
})
  .then(displaySuccess)
  .catch(displayError);

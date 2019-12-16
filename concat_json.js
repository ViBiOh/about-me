#!/usr/bin/env node

const fs = require('fs');
const utils = require('js-utils');
const resumeSchema = require('resume-schema');
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

function computeDates(payload) {
  payload.work.forEach(work => {
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

  return payload;
}

function validateSchema(payload) {
  resumeSchema.validate(payload, err => {
    if (err) {
      console.error('The resume is invalid:', err);
    }
  });

  return payload;
}

new Promise((resolve, reject) => {
  Promise.all(process.argv.slice(2).map(json => promiseReadFile(json, UTF_8)))
    .then(content => content.map(c => JSON.parse(c)))
    .then(files => {
      validateSchema(files[0]);
      return files;
    })
    .then(files => files.reduce((p, c) => Object.assign(p, c), {}))
    .then(computeDates)
    .then(payload => resolve(JSON.stringify(payload, null, 2)))
    .catch(reject);
})
  .then(displaySuccess)
  .catch(displayError);

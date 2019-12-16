#!/usr/bin/env node

const fs = require('fs');
const utils = require('js-utils');
const crypto = require('crypto');
const resumeSchema = require('resume-schema');
const dateFns = require('date-fns');

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

function computeHashes(payload) {
  payload.work.forEach(work => {
    work.id = `w${crypto
      .createHash('sha256')
      .update(work.company)
      .digest('hex')
      .substring(0, 10)}`;
  });

  return payload;
}

function formatDates(payload) {
  payload.work.forEach(work => {
    if (work.startDate) {
      try {
        const startDate = new Date(work.startDate);
        const endDate = work.endDate ? new Date(work.endDate) : new Date();

        work.startDate = dateFns.format(startDate, 'LLL yyyy');
        work.endDate = work.endDate ? dateFns.format(endDate, 'LLL yyyy') : work.endDate;
        work.duration = dateFns.formatDistance(startDate, endDate);
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
    .then(computeHashes)
    .then(formatDates)
    .then(payload => resolve(JSON.stringify(payload, null, 2)))
    .catch(reject);
})
  .then(displaySuccess)
  .catch(displayError);

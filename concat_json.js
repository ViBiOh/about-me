#!/usr/bin/env node

const fs = require('fs').promises;
const crypto = require('crypto');
const resumeSchema = require('resume-schema');
const dateFns = require('date-fns');

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

  payload.education.forEach(education => {
    if (education.startDate) {
      try {
        const startDate = new Date(education.startDate);
        const endDate = education.endDate ? new Date(education.endDate) : new Date();

        education.startDate = dateFns.format(startDate, 'LLL yyyy');
        education.endDate = education.endDate ? dateFns.format(endDate, 'LLL yyyy') : education.endDate;
      } catch (e) {
        console.error(e);
      }
    }
  });
}

function validateSchema(payload) {
  resumeSchema.validate(payload, err => {
    if (err) {
      console.error('The resume is invalid:', err);
    }
  });
}

(async () => {
  try {
    const content = await Promise.all(process.argv.slice(2).map(file => fs.readFile(file, 'utf-8')));

    const jsonContent = content.map(c => JSON.parse(c));
    validateSchema(jsonContent[0]);

    const data = jsonContent.reduce((p, c) => Object.assign(p, c), {});
    computeHashes(data);
    formatDates(data);

    displaySuccess(JSON.stringify(data, null, 2));
  } catch (e) {
    displayError(e);
  }
})();

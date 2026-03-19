const constants = require('./src/constants');
const utils = require('./src/utils');
const scoring = require('./src/scoring');
const language = require('./src/language');
const validation = require('./src/validation');
const logger = require('./src/logger');

module.exports = {
  ...constants,
  ...utils,
  ...scoring,
  ...language,
  ...validation,
  ...logger,
};

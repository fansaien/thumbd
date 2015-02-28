var config = require('./config').Config;

exports.info = function() {
  if (config.get('logLevel') === 'info') console.info.apply(this, [Date.now()].concat(arguments))
}

exports.warn = function() {
  var logLevel = config.get('logLevel');

  if (logLevel === 'info' || logLevel === 'warn') console.warn.apply(this, [Date.now()].concat(arguments))
}

exports.error = function() {
  if (config.get('logLevel') !== 'silent') console.warn.apply(this, [Date.now()].concat(arguments))
}

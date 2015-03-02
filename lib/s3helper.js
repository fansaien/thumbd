var AWS = require('aws-sdk'),
	fs = require('fs');
  
/**
 * Initialize the s3helper
 *
 * 
 */
function S3helper() {
	this.logger = require('./logger');
}

/**
 * Initialize a `Client` with the given `options`.
 *
 * Required:
 *
 *  - `key`     amazon api key
 *  - `secret`  amazon secret
 *  - `bucket`  bucket name string, ex: "learnboost"
 *
 * @param {Object} options
 * @api public
 */

var Client = module.exports = exports = function Client(options) {
  if (!options.key) throw new Error('aws "key" required');
  if (!options.secret) throw new Error('aws "secret" required');
  if (!options.bucket) throw new Error('aws "bucket" required');
  if (!options.region) throw new Error('aws "region" required');

  if (!options.endpoint) {
    if (!options.region || options.region === 'us-standard' || options.region === 'us-east-1') {
      options.endpoint = 's3.amazonaws.com';
      options.region = 'us-standard';
    } else if(options.region === 'cn-north-1'){
	  options.endpoint = 's3.cn-north-1.amazonaws.com.cn'; 
    } 
    else {
      options.endpoint = 's3-' + options.region + '.amazonaws.com';
    }
  } else {
    options.region = undefined;
  }
  
  AWS.config.update({accessKeyId: options.key, secretAccessKey: options.secret});
  AWS.config.update({region: options.region});

  this.s3 = new AWS.S3({signatureVersion: 'v4',region: options.region });
  this.bucket = options.bucket;
};


Client.prototype.getFile = function(remoteImagePath, fn){
  var params = {Bucket: this.bucket, Key: remoteImagePath};
  var awsStream = this.s3.getObject(params).createReadStream();
  fn(null,awsStream);
};

Client.prototype.putFile = function(source, destination, fn){
  var _this = this;
  var fileStream = fs.createReadStream(source);
  fileStream.on('error', function (err) {
  	if (err) { fn(err,null); }
  	return;
  });
  fileStream.on('open', function () {
  	_this.s3.putObject({
    		Bucket: _this.bucket,
			Key: destination,
			Body: fileStream
  		}, function (err,data) {
    		fn(err,data);
  		});
  });
  
};

exports.createClient = function(options){
  return new Client(options);
};


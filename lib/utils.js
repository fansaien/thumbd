var s3helper = require('./s3helper'),
  client = null,
  config = require('./config').Config;

/**
* Create an S3 client, for a specific bucket.
*
* @param string bucket S3 bucket to connect to.
*/


exports.s3 = function(_bucket, _region) {
  var bucket = _bucket || config.get('s3Bucket'),
    region = _region || config.get('awsRegion');

  // Knox wants 'us-standard' instead of 'us-east-1'.
	if (region == 'us-east-1') region = 'us-standard';

  // cache the most recently used client.

  
  if (client && bucket === client.bucket && region === client.region) {
    return client;
  } else {
    client = s3helper.createClient({
      key: config.get('awsKey'),
      secret: config.get('awsSecret'),
      bucket: bucket,
      region: region
    });
  }

  return client;
};

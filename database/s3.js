const aws = require('aws-sdk');
// const config = require('../config.json');
const { AWS_S3_HOSTNAME, AWS_S3_ACCESS_KEY, AWS_S3_SECRET } = process.env;

const spacesEndpoint = new aws.Endpoint(AWS_S3_HOSTNAME);

const s3 = new aws.S3({
  endpoint: spacesEndpoint
  // accessKeyId: config.accessKeyId || AWS_S3_ACCESS_KEY,
  // secretAcessKey: config.secretAccessKey || AWS_S3_SECRET
});

module.exports = s3;

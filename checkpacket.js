 var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'qa-account'});
AWS.config.credentials = credentials;

// Set the region 
AWS.config.update({region: 'us-west-2'});

// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Create the parameters for calling createBucket
var bucketParams = {
  Bucket : 'msp-seller-2',
  ACL : 'public-read'
};

// call S3 to create the bucket
var params = {};
s3.listBuckets(params, function(err, data) {
      if(err)
      console.log(err);
      else
      console.log(data);
    }
  )

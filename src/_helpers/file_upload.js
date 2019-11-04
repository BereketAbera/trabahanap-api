module.exports = fileUploader;

var fs = require('fs');
var path = require('path');
var config = require('../../config.json');
var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({ profile: 'qa-account' });
AWS.config.credentials = credentials;
// Set the region 
AWS.config.update({ region: 'us-west-2' });
// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });
var moment = require('moment');
var formidable = require('formidable');

function fileUploader() {
    
    return (req, res, next) => {
        var fileName;
        var imgPath;
        var form = new formidable.IncomingForm();
        form.on('fileBegin', (name, file) => {
            let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
            fileName = moment().format("YYYYMMDDHHmmssSS");
      
            file.path = config.localTempUploadFolder  + fileName + "." + fileExt;
            imgPath = file.path;
            console.log(fileName);
        });
        
        form.parse(req, (err, fields, files) => {
            req.body = fields;
            // console.log(err, fields, files);
        })
        res.send({meg: "development"});
        next();
    }
}
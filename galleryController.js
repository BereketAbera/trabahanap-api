var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({ profile: 'qa-account' });
AWS.config.credentials = credentials;
// Set the region 
AWS.config.update({ region: 'us-west-2' });
// Create S3 service object
const CONSTANTS = require('./constants')
s3 = new AWS.S3({ apiVersion: '2006-03-01' });
var moment = require('moment');
const Gallery = require('../models').gallery;
var moment = require('moment');
var formidable = require('formidable');
// var appRoot = require('app-root-path');

module.exports = {
  create(req, res) {
    let imgPath = "";
    let gallery = {};
    let fileName = ""
    let userId = req.user.id;
    var form = new formidable.IncomingForm();
    form.on('fileBegin', (name, file) => {
      let fileExt = file.name.substr(file.name.lastIndexOf('.') + 1);
      fileName = moment().format("YYYYMMDDHHmmssSS");
      file.path = CONSTANTS.baseDir + '/uploads' + fileName + "." + fileExt;
      imgPath = file.path;
    });
    form.on('file', function (name, file) {
      console.log('Uploaded ' + file.name);
    });
    form.on('field', function (name, value) {
      if (name == "name") {
        gallery[name] = value;
      }
      gallery.imagePath = imgPath;
      console.log('Uploaded ' + value);
    });
    form.parse(req, function (err, fields, files) {
      processFileUpload(userId, gallery, fileName).then(newImage => {
        let result = { success: true }
        return res.status(200).send(result);
      }
      ).catch(err => {
        console.log(err);
        if (err.hasOwnProperty('success')) {
          return res.status(200).json(err);
        }
        let errors = ["Invalid Data"];
        return res.status(200).json({ "success": false, "messages": errors });
      });

    });

  },
  list(req, res) {

    return Gallery
      .findAndCountAll({
        where: {
          sellerId: req.user.id
        },
        order: [
          ['id', 'DESC']
        ]
      })
      .then((pictures) => res.status(200).send(pictures))
      .catch((error) => {
        let errors = ["Invalid Data"];
        return res.status(200).json({ "success": false, "messages": errors });
      });
  },
  removePicture(req, res) {
    processRemovePicture(req.user.id, req.params).then(rmvPrdct => {
      let result = { success: true }
      return res.status(200).send(result);
    }
    ).catch(err => {
      if (err.hasOwnProperty('success')) {
        return res.status(200).json(err);
      }
      let errors = ["Invalid Data"];
      return res.status(200).json({ "success": false, "messages": errors });
    });

  },
};


function createGallery(gallery) {
  return Gallery.create(gallery).then(newGallery => {
    return newGallery;
  });
}
function uploadFilePromise(file, bucketName, fileName) {
  var uploadParams = { Bucket: bucketName, Key: fileName, Body: '', ACL: 'public-read' };
  var fileStream = fs.createReadStream(file);
  uploadParams.Body = fileStream;
  uploadParams.Key = path.basename(file);
  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, function (err, data) {
      if (err) {
        reject(err)
      } if (data) {
        resolve(data);
      } else {
        reject("system error");
      }
    });
  });
  // call S3 to retrieve upload file to specified bucket
}
function uploadFile(file, bucketName, fileName) {
  return uploadFilePromise(file, bucketName, fileName).then(data => {
    return data;
  });
}

async function processFileUpload(userId, gallery, fileName) {
  const imgObj = await uploadFile(gallery.imagePath, 'msp-seller-1', fileName)
  gallery.sellerId = userId;
  gallery.bucket = 'msp-seller-1';
  gallery.file = imgObj.Location;
  gallery.awsFileKey = fileName;
  const picture = await createGallery(gallery);
  return picture
}

const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

const multer = require('multer');
const { s3, mongoClient } = require('../database');
const { putObject, readFile } = require('../utils');
const { MONGO_COLLECTION, MONGO_DB } = require('../constants');

const { AWS_S3_BUCKETNAME } = process.env;

const destPath = path.join(__dirname, '..', 'uploads');
const upload = multer({
  dest: destPath
});

router.post('/upload', upload.single('image-file'), async (req, res) => {
  const filename = req.file.filename;
  const body = req.body;
  const doc = {
    ...body,
    filename,
    ts: new Date()
  };

  //save to s3 Promise
  const buffer = await readFile(req.file.path);
  const s3Result = putObject(req.file, buffer, s3, AWS_S3_BUCKETNAME);

  //save to mongo Promise
  const mongoResult = mongoClient
    .db(MONGO_DB)
    .collection(MONGO_COLLECTION)
    .insertOne(doc);

  try {
    const results = await Promise.all([mongoResult]);
    const doc = results[0].ops[0];
    res.status(200).json({ doc, insertedId: results[0].insertedId });
  } catch (error) {
    res.status(404).type('json').json({ myerror: error });
  } finally {
    fs.unlink(req.file.path, () => {
      console.log('clean up after upload');
    });
  }
});

module.exports = router;

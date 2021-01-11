const fs = require('fs');
const imageType = require('image-type');

//mysql helper
const makeQuery = (sql, pool) => {
  return async (args) => {
    const conn = await pool.getConnection();
    try {
      const [result, _] = await conn.query(sql, args || []);
      return result;
    } catch (err) {
      console.log(err);
      throw err;
    } finally {
      conn.release();
    }
  };
};

const startApp = async (app, ...promises) => {
  const PORT = parseInt(process.argv[2]) || parseInt(process.env.PORT) || 3000;

  await Promise.all(promises);
  app.listen(PORT, () => {
    console.log(`Application started on port ${PORT} at ${new Date()}`);
  });
};

//s3 helper function
const readFile = (path) =>
  new Promise((resolve, reject) =>
    fs.readFile(path, (err, buffer) => {
      if (err != null) reject(err);
      else resolve(buffer);
    })
  );

//s3 helper function
const putObject = (file, buffer, s3, bucketName) =>
  new Promise((resolve, reject) => {
    const params = {
      Bucket: bucketName,
      Key: file.filename,
      Body: buffer,
      ACL: 'public-read',
      ContentType: file.mimetype,
      ContentLength: file.size
    };
    s3.putObject(params, (err, result) => {
      if (err != null) reject(err);
      else resolve(result);
    });
  });

//s3 helper function
async function downloadFromS3(params, s3, res) {
  const metaData = await s3.headObject(params).promise();

  res.set({
    'X-Original-Name': metaData.Metadata.originalfilename
  });

  s3.getObject(params, function (err, data) {
    if (err) {
      console.log('error: ', err, err.stack);
      res.status(404).send({ error: err });
    }

    if (!data.Body) {
      return res.status(404).json({ error: 'blob not found' });
    }

    const fileData = data.Body;
    res.status(200).type(imageType(fileData).mime).send(fileData);
  });
}

//mongo helper
const aggregateFunc = async (gameId, collection) =>
  await collection
    .aggregate([
      {
        $match: {
          ID: gameId
        }
      },
      {
        $limit: 30
      },
      {
        $group: {
          _id: '$ID',
          reviews: {
            $push: '$_id'
          },
          ratings: {
            $push: '$rating'
          }
        }
      },
      {
        $project: {
          _id: 0,
          reviews: 1,
          avg_ratings: {
            $avg: '$ratings'
          }
        }
      }
    ])
    .toArray();

module.exports = {
  makeQuery,
  startApp,
  putObject,
  readFile,
  downloadFromS3
};

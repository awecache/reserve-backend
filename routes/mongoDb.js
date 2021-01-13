const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

const DATABASE = 'reserve_app';
const COLLECTION = 'customers';

const { mongoClient: client } = require('../database');

router.get('/customers', auth, async (req, res) => {
  const customers = await client
    .db('reserve_app')
    .collection('customers')
    .find()
    .toArray();
  res.json(customers);
});

router.post('/customer', async (req, res) => {
  const { name, contact } = req.body;
  console.log('name: >>', name);

  try {
    const { insertedId } = await client
      .db(DATABASE)
      .collection(COLLECTION)
      .insertOne({ name, contact });
    res.json({ customerId: insertedId });
  } catch (error) {
    console.log('error: ', error);
    res.json(error);
  }
});

module.exports = router;

const express = require('express');
const auth = require('../middlewares/auth');

const router = express.Router();

const DATABASE = 'reserve_app';
const COLLECTION = 'customers';

const { mongoClient: client } = require('../database');
const { ObjectId } = require('mongodb');

router.get('/customers', auth, async (req, res) => {
  try {
    const customers = await client
      .db('reserve_app')
      .collection('customers')
      .find()
      .toArray();
    res.json(customers);
  } catch (error) {
    console.log('error: ', error);
    res.json(error);
  }
});

router.get('/customer/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await client
      .db('reserve_app')
      .collection('customers')
      .findOne({ _id: ObjectId(id) }, { _id: 0, name: 1, contact: 1 });

    console.log('customer found: ', customer);

    res.json(customer);
  } catch (error) {
    console.log('error: ', error);
    res.json(error);
  }
});

router.post('/customer', async (req, res) => {
  const { name, contact, email } = req.body;

  try {
    const { insertedId } = await client
      .db(DATABASE)
      .collection(COLLECTION)
      .insertOne({ name, contact, email });
    res.json({ customerId: insertedId });
  } catch (error) {
    console.log('error: ', error);
    res.json(error);
  }
});

module.exports = router;

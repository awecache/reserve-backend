const express = require('express');

const { mysqlPool } = require('../database');
const { getOrdersQuery } = require('../queries');
const { makeQuery } = require('../utils');

const router = express.Router();

const getOrders = makeQuery(getOrdersQuery, mysqlPool);

router.get('/mysql/orders', async (req, res) => {
  try {
    const orders = await getOrders();
    console.log('orders', orders);
    res.status(200).json({ orders });
  } catch (error) {
    console.log('error', error);
    res.status(404).json({ error });
  }
});

module.exports = router;

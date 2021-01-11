const express = require('express');
const router = express.Router();
const { northwindPool } = require('../database');

const {
  getOrdersQuery,
  addOrderQuery,
  addOrderDetailsQuery
} = require('../queries');
const { makeQuery } = require('../utils');

const getOrders = makeQuery(getOrdersQuery, northwindPool);

router.get('/orders', async (req, res) => {
  try {
    const results = await getOrders();
    console.log('results', results);
    res.status(200).json({ results });
  } catch (err) {
    console.log('error', err);
  }
});

router.post('/order', async (req, res) => {
  const body = req.body;
  insertOrder(res);
});

//create transaction for inserting new order
const insertOrder = async (res) => {
  const conn = await northwindPool.getConnection();
  try {
    await conn.beginTransaction();

    const orderResults = await conn.query(addOrderQuery, [
      '2020-12-06',
      'my ship2',
      0.06
    ]);
    const orderId = orderResults[0].insertId;
    const orderDetailsResults = await conn.query(addOrderDetailsQuery, [
      orderId,
      10,
      2.5,
      0.2,
      '2020-12-12'
    ]);
    const orderDetailsId = orderDetailsResults[0].insertId;

    await conn.commit();

    res.format({
      html: () => {
        console.log('html');
        res.status(200).send('');
      },
      json: () => {
        console.log('json');
        res.status(200).json({
          insertedOrderId: orderId,
          insertedOrderDetailsId: orderDetailsId
        });
      },
      text: () => {
        res.sattus(200).send('Order added successully');
      },
      default: () => {
        res.status(406).send('Not Acceptable');
      }
    });
  } catch (err) {
    // conn.rollback();
    console.log('error', err);
    res.send(err);
  } finally {
    conn.release();
  }
};

module.exports = router;

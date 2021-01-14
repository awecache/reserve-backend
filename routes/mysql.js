const express = require('express');
const moment = require('moment');
const nodemailer = require('nodemailer');

const { mongoClient: client } = require('../database');
const { ObjectId } = require('mongodb');

const { mysqlPool } = require('../database');
const {
  getTimeslotsQuery,
  getTimeslotsByAvailabilityQuery,
  getTablesQuery,
  getAllReservationsQuery,
  getReservationsByDateTimeQuery,
  getReservationsByRangeQuery,
  getReservationByBookRefQuery,
  deleteReservationById,
  getTablesByMinMaxQuery,
  insertReservationQuery
} = require('../queries');
const { makeQuery } = require('../utils');

const DATABASE = 'reserve_app';
const COLLECTION = 'customers';

const router = express.Router();

const getTimeslots = makeQuery(getTimeslotsQuery, mysqlPool);
const getTimeslotsByAvailability = makeQuery(
  getTimeslotsByAvailabilityQuery,
  mysqlPool
);

const getTables = makeQuery(getTablesQuery, mysqlPool);
const getTablesByMinMax = makeQuery(getTablesByMinMaxQuery, mysqlPool);

const getAllReservations = makeQuery(getAllReservationsQuery, mysqlPool);
const getReservationsByDateTime = makeQuery(
  getReservationsByDateTimeQuery,
  mysqlPool
);
const getReservationsByRange = makeQuery(
  getReservationsByRangeQuery,
  mysqlPool
);
const getReservationByBookRef = makeQuery(
  getReservationByBookRefQuery,
  mysqlPool
);

const insertReservation = makeQuery(insertReservationQuery, mysqlPool);

router.get('/timeslots', async (req, res) => {
  try {
    const availability = req.query.availability;
    if (!availability) {
      const timeslots = await getTimeslots();
      return res.status(200).json(timeslots);
    }

    const timeslots = await getTimeslotsByAvailability([availability]);
    return res.status(200).json(timeslots);
  } catch (error) {
    console.log('error', error);
    res.status(404).json({ error });
  }
});

router.get('/tables', async (req, res) => {
  try {
    const pax = req.query.pax;
    const ignoreMin = req.query.ignore_min;

    if (!pax) {
      const tables = await getTables();
      return res.status(200).json(tables);
    }

    if (pax && ignoreMin === 'true') {
      const tables = await getTablesByMinMax([999, pax]);
      return res.status(200).json(tables);
    }

    const tables = await getTablesByMinMax([pax, pax]);

    res.status(200).json(tables);
  } catch (error) {
    console.log('error', error);
    res.status(404).json({ error });
  }
});

router.get('/reservations', async (req, res) => {
  const {
    date,
    timeslot_id: timeslotId,
    start_time: startTime,
    end_time: endTime,
    book_ref: bookRef
  } = req.query;
  try {
    if (bookRef) {
      console.log('bookRef>>>', bookRef);
      const reservation = await getReservationByBookRef([bookRef]);
      return res.status(200).json(reservation);
    }

    if (date && startTime && endTime) {
      const reservations = await getReservationsByRange([
        date,
        startTime,
        endTime
      ]);

      return res.status(200).json(reservations);
    }

    if (date && timeslotId) {
      const reservations = await getReservationsByDateTime([date, timeslotId]);
      return res.status(200).json(reservations);
    }
    // const dateMoment = moment(date);
    // console.log('dateMoment>>', dateMoment);
    // const nextDate = dateMoment.add(1, 'days').format('YYYY/MM/DD HH:mm:ss');

    // console.log('reservations>>', reservations);
    const reservations = await getAllReservations();
    return res.status(200).json(reservations);
  } catch (error) {
    console.log('error', error);
    res.status(404).json({ error });
  }
});

router.post('/reservation', async (req, res) => {
  const { customerId, timestamp, tableId, timeslotId, pax, bookRef } = req.body;

  try {
    const result = await insertReservation([
      timestamp,
      timeslotId,
      pax,
      tableId,
      customerId,
      bookRef
    ]);
    res.status(200).json(result);
  } catch (error) {
    console.log('error: ', error);
    res.status(404).json(error);
  }
});

router.post('/send', (req, res) => {
  const { name, contact, email, bookRef, date, time, pax } = req.body;
  console.log('send req.body>>', req.body);

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const text = `Dear Mr/Mdm ${name}, here is your reservation of ${pax} pax on ${date} at ${time}. 
  Your booking reference is ${bookRef}.`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Reservation Confirmation',
    text: text,
    replyTo: process.env.EMAIL
  };

  transporter.sendMail(mailOptions, (err, res) => {
    if (err) {
      console.error('there was an error: ', err);
    } else {
      console.log('here is the res: ', res);
    }
  });
  res.json({ success: 'success' });
});

router.delete('/reservation/:ref', async (req, res) => {
  const { ref } = req.params;
  const conn = await mysqlPool.getConnection();
  try {
    const reservation = await getReservationByBookRef([ref]);

    if (!reservation.length) {
      return res.json({
        status: 'no reservation with matching booking ref found'
      });
    }

    //may not need to delete
    const customerId = reservation[0].customer_id;
    console.log('customer id: ', customerId);

    await client
      .db(DATABASE)
      .collection(COLLECTION)
      .deleteOne({ _id: ObjectId(customerId) });

    conn.query(deleteReservationById, [reservation[0].id]);
    console.log('reserve id: ', reservation[0].id);

    conn.beginTransaction();

    res.json({ status: 'delete reservation success' });
    conn.commit();
  } catch (e) {
    conn.rollback();
    return res.status(500).json({ status: 'delete reservation failed' });
  } finally {
    conn.release();
  }
});

module.exports = router;

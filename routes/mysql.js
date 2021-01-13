const express = require('express');
const moment = require('moment');

const { mysqlPool } = require('../database');
const {
  getTimeslotsQuery,
  getTimeslotsByAvailabilityQuery,
  getTablesQuery,
  getAllReservationsQuery,
  getReservationsByDateTimeQuery,
  getTablesByMinMaxQuery,
  insertReservationQuery
} = require('../queries');
const { makeQuery } = require('../utils');

const router = express.Router();

const getTimeslots = makeQuery(getTimeslotsQuery, mysqlPool);
const getTimeslotsByAvailability = makeQuery(
  getTimeslotsByAvailabilityQuery,
  mysqlPool
);

const getTables = makeQuery(getTablesQuery, mysqlPool);
const getTablesByMinMax = makeQuery(getTablesByMinMaxQuery, mysqlPool);

const getAllReservation = makeQuery(getAllReservationsQuery, mysqlPool);
const getReservationByDateTime = makeQuery(
  getReservationsByDateTimeQuery,
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
  const { date, timeslot_id: timeslotId } = req.query;
  try {
    if (!date && !timeslotId) {
      const reservations = await getAllReservation();

      return res.status(200).json(reservations);
    }
    // const dateMoment = moment(date);
    // console.log('dateMoment>>', dateMoment);
    // const nextDate = dateMoment.add(1, 'days').format('YYYY/MM/DD HH:mm:ss');

    const reservations = await getReservationByDateTime([date, timeslotId]);
    // console.log('reservations>>', reservations);

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

module.exports = router;

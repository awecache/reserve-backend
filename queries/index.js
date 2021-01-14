const getTimeslotsQuery = 'SELECT * FROM reserve_app.timeslot';
const getTimeslotsByAvailabilityQuery =
  'SELECT * FROM reserve_app.timeslot WHERE availability =?';

const getTablesQuery = 'SELECT * FROM reserve_app.tables_for_reservation';
const getTablesByMinMaxQuery =
  'SELECT * FROM reserve_app.tables_for_reservation WHERE min_pax<=? and max_pax>=?';

const getAllReservationsQuery = 'SELECT * FROM reserve_app.reservations';
const getReservationsByDateTimeQuery = `SELECT * FROM reserve_app.reservations
WHERE date = ? AND timeslot_id=?`;

const getReservationsByRangeQuery = `
SELECT * FROM reserve_app.reservations_view
WHERE date=? AND time between ? AND ? 
ORDER BY time asc;
`;

const insertReservationQuery = `INSERT INTO reserve_app.reservations (date, timeslot_id, pax, table_id, customer_id, book_ref) VALUES (?,?,?,?,?,?)`;

const getUserWithIdAndPassQuery =
  'select user_id from reserve_app.user where user_id = ? and password = sha1(?)';

const getUserByEmailQuery =
  'select user_id from reserve_app.user where email = ? ';

const getReservationByBookRefQuery = `SELECT * FROM reserve_app.reservations_view
  WHERE book_ref=?`;

const deleteReservationById = `DELETE FROM reserve_app.reservations WHERE id = ?`;

module.exports = {
  getTimeslotsQuery,
  getTimeslotsByAvailabilityQuery,
  getTablesQuery,
  getTablesByMinMaxQuery,
  getAllReservationsQuery,
  getReservationsByDateTimeQuery,
  getReservationsByRangeQuery,
  getReservationByBookRefQuery,
  insertReservationQuery,
  deleteReservationById,
  getUserWithIdAndPassQuery,
  getUserByEmailQuery
};

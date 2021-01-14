const getTimeslotsQuery = 'SELECT * FROM reserve_app.timeslot';
const getTimeslotsByAvailabilityQuery =
  'SELECT * FROM reserve_app.timeslot WHERE availability =?';

const getTablesQuery = 'SELECT * FROM reserve_app.tables_for_reservation';
const getTablesByMinMaxQuery =
  'SELECT * FROM reserve_app.tables_for_reservation WHERE min_pax<=? and max_pax>=?';

const getAllReservationsQuery = 'SELECT * FROM reserve_app.reservations';
const getReservationsByDateTimeQuery = `SELECT * FROM reserve_app.reservations
WHERE date = ? AND timeslot_id=?`;

const insertReservationQuery = `INSERT INTO reserve_app.reservations (date, timeslot_id, pax, table_id, customer_id, book_ref) VALUES (?,?,?,?,?,?)`;

const getUserWithIdAndPassQuery =
  'select user_id from user where user_id = ? and password = sha1(?)';

const getUserByEmailQuery = 'select user_id from user where email = ? ';

const addOrderQuery = `insert into orders (order_date, ship_name,tax_rate) 
values
(?,?,?)`;
// ("2020-12-09", "my ship",0.07);

// insert into order_details (order_id, quantity,unit_price,discount,date_allocated)
// values ("82",10,2.50,0.2,"2020-12-12");
const addOrderDetailsQuery = `insert into order_details (order_id, quantity,unit_price,discount,date_allocated)
values (?,?,?,?,curdate());
`;

const getInsertedKeyQuery = `SELECT LAST_INSERT_ID()`;

const insertFileQuery = `insert into files (file_buffer) values (?)`;

const getFileQuery = `select file_buffer from files where file_id = ?`;

module.exports = {
  getTimeslotsQuery,
  getTimeslotsByAvailabilityQuery,
  getTablesQuery,
  getTablesByMinMaxQuery,
  getAllReservationsQuery,
  getReservationsByDateTimeQuery,
  insertReservationQuery,
  getUserWithIdAndPassQuery,
  getUserByEmailQuery,
  addOrderQuery,
  addOrderDetailsQuery,
  getInsertedKeyQuery,
  insertFileQuery,
  getFileQuery
};

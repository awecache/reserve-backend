const getOrdersQuery = 'SELECT * FROM northwind.orders';

// `INSERT INTO rsvp (name, email, phone, status, createdBy, createdDt) VALUES (?,?,?,?,?,CURDATE());`;
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
  getOrdersQuery,
  addOrderQuery,
  addOrderDetailsQuery,
  getInsertedKeyQuery,
  insertFileQuery,
  getFileQuery
};

const mysql = require('mysql');

//Create connection
const options = {
  host : 'localhost',
  user : 'root',
  password : 'K@Lender12',
  database: 'userpassdb',
  checkExpirationInterval: 900000,// How frequently expired sessionswill be cleared in milliseconds
  expiration: 1512671400000,// The maximum age of a valid session; milliseconds.
  createDatabaseTable:  true,// Whether or not to create the sessions database table, if one does not already exist.
  connectionLimit: 10,// Number of connectionswhen creating a connection pool
  schema: { tableName: 'sessions',
  columnNames: { session_id: 'session_id', expires: 'expires', data:
  'data' } }
}

const db = mysql.createConnection(options);


//Connect to database
db.connect((err)=>{
  if(err){
    throw err;
  }

  console.log('MySql Connected!')
});

module.exports = db;

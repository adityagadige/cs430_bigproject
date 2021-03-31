const mysql = require("mysql");

module.exports = dbConnect();
//mysql db connection
function dbConnect(){
let connection =  mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'goodhealthpharm',
  dateStrings: true,
  multipleStatements: true
});

connection.connect(function(err) {
if (err) {
  console.error('error connecting: ' + err.stack);
  return;
}
console.log('connected as id ' + connection.threadId);
});

return connection;

}

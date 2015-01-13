var MineConnection = require("./libs/connection.js");
var events = require('events');

exports.connection = MineConnection;

var conn = new MineConnection();

conn.on("test", function() {
    console.log("hoi");
});

conn.connect(25565, '127.0.0.1', function(err, connection) {
    console.log(err);
});
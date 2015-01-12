var MineConnection = require("./libs/connection.js");

exports.connection = MineConnection;
MineConnection.connect(25565, '127.0.0.1');
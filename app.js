var net = require("net"),
	system = require("./libs/system.js"),
	MineConnection = require("./libs/connection.js");

system.log(MineConnection.connect());
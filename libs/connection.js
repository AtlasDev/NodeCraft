var system = require("./system.js");
var requestify = require("requestify");
var varint = require("varint");
var net = require("net");
var bufferpack = require("bufferpack");

var _loggedin = false;
var _username;
var _connection;

var isLoggedin = function() {
	return _loggedin;
}
exports.isLoggedin = isLoggedin;

var getUsername = function() {
	return _username;
}
exports.getUsername = getUsername;

var setUsername = function(username) {
	_username = username;
	return true;
}
exports.setUsername = setUsername;

var login = function(username, password) {
	requestify.post('https://api.mojang.com/users/profiles/minecraft/SilentsKiller', {
		data: "test"
    }).then(function(response) {
        console.log(response.body);
    });
}
exports.login = login;

var connect = function(port, host, callback) {
	_connection = new net.Socket();
    _connection.connect(port, host, function() {
        system.log('Connected to the server, authenticating now.');
        
        var PACKET_HEAD = new Buffer([
            0, // Packet ID 0
            47 // Version 4 (1.7.2), 5 is 1.7.6
        ]);
        var PACKET_PORT = new Buffer(2);
        var PACKET_NEXTSTATE = new Buffer([1]);
        var PACKET_STATUS_REQ = new Buffer([1, 0]);


        host = new Buffer(host);
        var addrLen = new Buffer(varint.encode(host.length));

        PACKET_PORT.writeUInt16BE(port, 0);

        var packetLength = 2 + addrLen.length + host.length + 2 + 1;
        var lengthBuffer = new Buffer(varint.encode(packetLength));

        var packet = Buffer.concat([
            lengthBuffer,
            PACKET_HEAD,
            addrLen,
            host,
            PACKET_PORT,
            PACKET_NEXTSTATE,
            PACKET_STATUS_REQ
        ], packetLength + 3);

        _connection.write(packet);

        /*
        TRY 1
        ------*/
        var packet;
        packet = "\x00";
        packet += "\x04";
        packet += bufferpack.pack('c', host.length.toString()) + host;
        packet += bufferpack.pack('n', port.toString());
        packet += "\x01";
        packet = bufferpack.pack('c', packet.length.toString()) + packet;

        _connection.write(packet);
        _connection.write("\x01\x00");


        /*TRY 2
        -------*/
        var packet;
        packet = packData(
            '\x00\x00' 
            + packData(host.toString('utf8'))
            + packPort(port)
            + '\x01'
        );

        _connection.write(packet);
        _connection.write(packData('\x00'));
        
    });
    _connection.on('error', function(err){
        system.log(err);
        _connection.end();
    });
    _connection.on('data', function(data){
        system.log(data);
    });
};
exports.connect = connect;

function packData(data) {
    return varint.encode(data.length) + data;
}

function packPort(data) {
    return bufferpack.pack('>H', data.toString());
}
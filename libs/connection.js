var varint = require("varint");
var net = require("net");
var bufferpack = require("bufferpack");
var util = require("util");
var events = require("events");

function connection() {
    var _connection;
    var _mode = 'handshake';
    events.EventEmitter.call(this);
}

util.inherits(connection, events.EventEmitter);

connection.prototype.connect = function(port, host, callback) {
    var self = this;
    _connection = new net.Socket();
    _connection.connect(port, host, function() {
        console.log('Connected to the server, authenticating now.');
        
        var PACKET_HEAD = new Buffer([
            0, // Packet ID
            47 // Protocol version, 47 from 1.8
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
        var error = new Error(err.code);
        error.mode = err.syscall;
        if(err.syscall === 'connect') {
            self.emit("test");
            callback(error);
        } else {
            console.log('Uncaught error in NodeCraft, please report the following:');
            console.log(error);
            console.log('Exiting NOW!');
            process.exit(1);
        }
    });
    _connection.on('data', function(data){
        console.log(data);
    });
};

function packData(data) {
    return varint.encode(data.length) + data;
}

function packPort(data) {
    return bufferpack.pack('>H', data.toString());
}
module.exports = connection;
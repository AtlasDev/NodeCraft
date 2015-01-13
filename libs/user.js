var requestify = require("requestify");

var _loggedin = false;
var _username;

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
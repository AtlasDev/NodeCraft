var colors = require('colors'),
    moment = require('moment');
    
colors.setTheme({
    debug: 'cyan',
    warn: 'yellow',
    error: 'red'
});

function log(text, level) {
    if(level == 4) {
        console.error(colors.error(time() + " [SERVERE] " + text));
    } else if(level == 3) {
        console.error(colors.error(time() + " [ERROR] " + text));
    } else if(level == 2) {
        console.warn(colors.warn(time() + " [WARN] " + text));
    } else if(level == 1) {
        if(config.debug) {
            console.log(colors.debug(time() + " [DEBUG] " + text));
        }
    } else {
        console.info(time() + " [INFO] " + text);
    }
}
exports.log = log;

function time() {
    return moment().format("HH:mm:ss");
}
exports.time = time;
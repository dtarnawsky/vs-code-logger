let _log;
let _warn;
let _error;
let _info;
let _deviceIdentifier;
let _serverUrl;
let _pending = undefined;
/**
 * Initialize logging will override window.console and send to the serverUrl
 * @param  {string} serverUrl The servername and port number of the remote server (eg 192.168.1.1:9000)
 */
export function initLogger(serverUrl) {
    _log = window.console.log;
    _warn = window.console.error;
    _error = window.console.error;
    _info = window.console.info;
    _serverUrl = serverUrl;
    window.console.log = consoleLog;
    window.console.warn = consoleWarn;
    window.console.error = consoleError;
    window.console.info = consoleInfo;
    let lastUrl;
    post('/devices', {
        id: getDeviceIdentifier(),
        agent: window.navigator.userAgent,
        title: window.document.title,
    });
    // Report urls
    setInterval(() => {
        if (document.location.href != lastUrl) {
            lastUrl = document.location.href;
            _log(`Url changed to ${lastUrl}`);
        }
    }, 1000);
}
function getDeviceIdentifier() {
    if (_deviceIdentifier) {
        return _deviceIdentifier;
    }
    const tmp = localStorage.IonicLoggerDeviceId;
    let id = parseInt(tmp);
    if (tmp == null || isNaN(id)) {
        // Create a random device identifier
        id = Math.floor(Math.random() * 999999999);
        localStorage.IonicLoggerDeviceId = id;
    }
    _deviceIdentifier = id.toString();
    return _deviceIdentifier;
}
function write(message, _arguments, level) {
    const args = Array.prototype.slice.call(_arguments);
    let msg = message;
    args.forEach((element) => {
        if (msg != '') {
            msg += ' ';
        }
        if (typeof element == 'object') {
            msg += JSON.stringify(element);
        }
        else {
            msg += element;
        }
    });
    // Commenting out for now. Stack is hard as it may be in the source map
    //const stack = this.getStack();
    if (!_pending) {
        _pending = [];
        setTimeout(() => {
            // Push pending log entries. We wait around for 500ms to see how much accumulates
            post('/log', _pending);
            _pending = undefined;
        }, 500);
    }
    _pending.push({ id: getDeviceIdentifier(), message: msg, level: level }); // this.getStack() });
}
function getStack() {
    const stack = new Error().stack;
    const lines = stack === null || stack === void 0 ? void 0 : stack.split('\n');
    lines === null || lines === void 0 ? void 0 : lines.splice(0, 4);
    if (!lines || lines.length == 0) {
        return '';
    }
    return lines[0].substr(7, lines[0].length - 7); // This returns just the top of the stack
}
function post(url, data) {
    if (!data) {
        return;
    }
    try {
        fetch(`http://${_serverUrl}${url}`, {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
    }
    catch (_a) {
        // Logging should not cause failures
    }
}
function consoleLog(message, ...args) {
    _log(message, ...args);
    write(message, args, 'log');
}
function consoleWarn(message, ...args) {
    _warn(message, ...args);
    write(message, args, 'warn');
}
function consoleError(message, ...args) {
    _error(message, ...args);
    write(message, args, 'error');
}
function consoleInfo(message, ...args) {
    _info(message, ...args);
    write(message, args, 'info');
}

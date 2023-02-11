let _log: Function;
let _warn: Function;
let _error: Function;
let _info: Function;
let _deviceIdentifier: string;
let _serverUrl: string;

/**
 * Initialize logging will override window.console and send to the serverUrl
 * @param  {string} serverUrl The servername and port number of the remote server (eg 192.168.1.1:9000)
 */
export function initLogger(serverUrl: string) {
    _log = window.console.log;
    _warn = window.console.error;
    _error = window.console.error;
    _info = window.console.info;
    _serverUrl = serverUrl;
    window.console.log = consoleLog;
    window.console.warn = consoleWarn;
    window.console.error = consoleError;
    window.console.info = consoleInfo;

    let lastUrl: string;
    post('/devices', {
        id: getDeviceIdentifier(),
        agent: window.navigator.userAgent,
        title: window.document.title,
    });

    // Report urls
    setInterval(() => {
        if (document.location.href != lastUrl) {
            lastUrl = document.location.href;
            this.log(`Url changed to ${lastUrl}`);
        }
    }, 1000);
}

function getDeviceIdentifier(): string {
    if (_deviceIdentifier) {
        return _deviceIdentifier.toString();
    }
    const tmp = localStorage.IonicLoggerDeviceId;
    let id: number = parseInt(tmp);
    if (tmp == null || isNaN(id)) {
        // Create a random device identifier
        id = Math.floor(Math.random() * 999999999);
        localStorage.IonicLoggerDeviceId = id;
    }
    this._deviceIdentifier = id;
    return id.toString();
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
        } else {
            msg += element;
        }
    });
    // Commenting out for now. Stack is hard as it may be in the source map
    //const stack = this.getStack();

    if (!this.pending) {
        setTimeout(() => {
            // Push pending log entries. We wait around for 1 second to see how much accumulates
            post('/log', this.pending);
            this.pending = undefined;
        }, 500);
        this.pending = [];
    }
    this.pending.push({ id: this.getDeviceIdentifier(), message: msg, level: level, stack: undefined }); // this.getStack() });
}

function getStack(): string {
    const stack = new Error().stack;
    const lines = stack?.split('\n');
    lines?.splice(0, 4);
    if (!lines || lines.length == 0) {
        return '';
    }
    return lines[0].substr(7, lines[0].length - 7); // This returns just the top of the stack
}

function post(url: string, data: any) {
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
    } catch {
        // Logging should not cause failures
    }
}

function consoleLog(message, ...args) {
    _log.call(this, message, ...args);
    write(message, args, 'log');
}

function consoleWarn(message, ...args) {
    _warn.call(this, message, ...args);
    write(message, args, 'warn');
}

function consoleError(message, ...args) {
    _error.call(this, message, ...args);
    write(message, args, 'error');
}

function consoleInfo(message, ...args) {
    _info.call(this, message, ...args);
    write(message, args, 'info');
}
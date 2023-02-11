"use strict";var _log,_warn,_error,_info,_deviceIdentifier,_serverUrl,__spreadArray=this&&this.__spreadArray||function(o,e,r){if(r||2===arguments.length)for(var n,t=0,i=e.length;t<i;t++)!n&&t in e||((n=n||Array.prototype.slice.call(e,0,t))[t]=e[t]);return o.concat(n||Array.prototype.slice.call(e))};function initLogger(o){var e,r=this;_log=window.console.log,_warn=window.console.error,_error=window.console.error,_info=window.console.info,_serverUrl=o,window.console.log=consoleLog,window.console.warn=consoleWarn,window.console.error=consoleError,window.console.info=consoleInfo,post("/devices",{id:getDeviceIdentifier(),agent:window.navigator.userAgent,title:window.document.title}),setInterval(function(){document.location.href!=e&&(e=document.location.href,r.log("Url changed to ".concat(e)))},1e3)}function getDeviceIdentifier(){var o,e;return(_deviceIdentifier||(o=localStorage.IonicLoggerDeviceId,e=parseInt(o),null!=o&&!isNaN(e)||(e=Math.floor(999999999*Math.random()),localStorage.IonicLoggerDeviceId=e),this._deviceIdentifier=e)).toString()}function write(o,e,r){var n=this,e=Array.prototype.slice.call(e),t=o;e.forEach(function(o){""!=t&&(t+=" "),t+="object"==typeof o?JSON.stringify(o):o}),this.pending||(setTimeout(function(){post("/log",n.pending),n.pending=void 0},500),this.pending=[]),this.pending.push({id:this.getDeviceIdentifier(),message:t,level:r,stack:void 0})}function getStack(){var o=(new Error).stack,o=null==o?void 0:o.split("\n");return null!=o&&o.splice(0,4),o&&0!=o.length?o[0].substr(7,o[0].length-7):""}function post(o,e){if(e)try{fetch("http://".concat(_serverUrl).concat(o),{method:"post",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)})}catch(o){}}function consoleLog(o){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];_log.call.apply(_log,__spreadArray([this,o],e,!1)),write(o,e,"log")}function consoleWarn(o){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];_warn.call.apply(_warn,__spreadArray([this,o],e,!1)),write(o,e,"warn")}function consoleError(o){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];_error.call.apply(_error,__spreadArray([this,o],e,!1)),write(o,e,"error")}function consoleInfo(o){for(var e=[],r=1;r<arguments.length;r++)e[r-1]=arguments[r];_info.call.apply(_info,__spreadArray([this,o],e,!1)),write(o,e,"info")}exports.__esModule=!0,exports.initLogger=void 0,exports.initLogger=initLogger;
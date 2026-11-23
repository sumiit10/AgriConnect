const dns = require('node:dns');

if (process.platform === 'win32') {
    dns.setServers(['1.1.1.1', '8.8.8.8']);
}
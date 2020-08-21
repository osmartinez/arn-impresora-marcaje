const fs = require('fs');

module.exports = {
    getSettings() {
        let rawdata = fs.readFileSync('./printer-settings.json');
        let settings = JSON.parse(rawdata);
        return settings
    }
}

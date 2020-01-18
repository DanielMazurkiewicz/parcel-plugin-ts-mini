const fs = require('fs');

module.exports = (filePath) => {
    const content = fs.readFileSync(filePath).toString();
    return JSON.parse(content);
}
const fs = require('fs');

module.exports = (filePath, json) => {
    const content = JSON.stringify(json, null, 4);
    fs.writeFileSync(filePath, content);
}
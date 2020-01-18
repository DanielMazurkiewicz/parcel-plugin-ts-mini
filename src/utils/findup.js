const path = require('path');
const fs = require('fs');

module.exports = (fileName, currentPath, firstOneOnly) => {
    const result = [];
    currentPath = path.resolve(currentPath);
    if (fs.existsSync(currentPath)) {
        if (fs.lstatSync(currentPath).isFile()) currentPath = path.dirname(currentPath);

        while(1) {
            const fullPath = path.join(currentPath, fileName);
            if (fs.existsSync(fullPath) && fs.lstatSync(fullPath).isFile()) {
                const resultDescription = {fullPath, fileName, directory: currentPath, getFilePath: (fileName) => {
                    const filePath = path.join(currentPath, fileName);
                    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) return filePath;
                }};
                if (firstOneOnly) return resultDescription;
                result.unshift(resultDescription);
            }
            const oldPath = currentPath;
            currentPath = path.dirname(currentPath);
            if (oldPath === currentPath) {
                if (result.length) return result;
                return;
            }
        }
    }
}

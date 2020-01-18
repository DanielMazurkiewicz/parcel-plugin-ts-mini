"use strict"
/*

    Changes that will be applied to executable code

*/

const langChange = require('./plugins/lang/change')

module.exports = (source, ts, filePath, options) => {
    source = langChange(source, ts, filePath, options)
    return source;
}
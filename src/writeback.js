"use strict"
/*

    Write back feeds source files with demanded information and data 

*/


const langWriteback = require('./plugins/lang/writeback');

module.exports = (source, ts, filePath, options) => {
    source = langWriteback(source, ts, filePath, options)
    return source;
}
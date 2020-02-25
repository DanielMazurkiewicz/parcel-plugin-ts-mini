"use strict"
/*

    Write back feeds source files with demanded information and data 

*/


const langWriteback = require('./plugins/lang/writeback');
const enumWriteback = require('./plugins/enum/writeback');
const interfaceWriteback = require('./plugins/interface/writeback');

module.exports = (source, ts, filePath, options) => {
    source = langWriteback(source, ts, filePath, options);
    source = enumWriteback(source, ts, filePath, options);
    // source = interfaceWriteback(source, ts, filePath, options);
    return source;
}
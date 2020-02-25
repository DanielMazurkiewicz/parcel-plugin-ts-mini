"use strict"
/*

    Write back feeds source files with demanded information and data 

*/


const Replacer = require('../../utils/Replacer');
const getTsmCommands = require('../../utils/getTsmCommands');


const propertiesLists = {};

module.exports = (source, ts, filePath, {env}) => {

    const sourceFile = ts.createSourceFile(
        filePath,
        source,
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ true
    );

    function visitor(node) {
        // console.log('VISITOR', node.getFullText());
        if (ts.isInterfaceDeclaration(node)) {
            // console.log('INTERFACE');
            getTsmCommands(ts, source, node)
                .cmd('list', (comment, listName = 'default') => {
                    console.log('LIST', listName);
                    if(!propertiesLists[listName]) propertiesLists[listName] = {};
                    node.members.forEach(member => {
                        // console.log(member)
                        propertiesLists[listName][member.name.escapedText] = 1;
                    });
                })
                .run();
        } 

        return ts.forEachChild(node, visitor);
    }

    visitor(sourceFile);

    console.log(propertiesLists)

    return source;
}
"use strict"
/*

    Write back feeds source files with demanded information and data 

*/


const Replacer = require('../../utils/Replacer');
const getTsmCommands = require('../../utils/getTsmCommands');


module.exports = (source, ts, filePath, {env}) => {

    const sourceFile = ts.createSourceFile(
        filePath,
        source,
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ true
    );

    const replacer = Replacer(source);

    function visitor(node) {

        const processEnum = (isPositive, startFrom, startFromProperty) => {
            let startFromMember;
            node.members.forEach(member => {
                if (member.name.escapedText === startFromProperty) {
                    startFromMember = member;
                } else if (!member.initializer) {
                    // replacer.replace(member, member.getFullText() + ' = ' + startFrom);
                    replacer.addBehind(member, ' = ' + startFrom);
                    startFrom += isPositive;
                }
            });
            return {startFrom, startFromMember}
        }

        const processVariable = (isPositive, startFrom, startFromProperty) => {
            let startFromMember;
            node.declarationList.declarations.forEach(declaration => {
                const name = declaration.name.escapedText;
                if (name === startFromProperty) {
                    startFromMember = declaration;
                } else if (declaration.initializer.escapedText === 'NaN') {
                    replacer.replace(declaration, name + ' = ' + startFrom);
                    startFrom += isPositive;
                }
            })
            return {startFrom, startFromMember}
        }

        const process = (what) => (comment, isPositive, startFrom, startFromProperty) => {
            if (isPositive === 'false' || isPositive === 'negative') {
                isPositive = -1;
            } else {
                isPositive = 1;
            }

            if (startFrom === undefined) {
                startFrom = isPositive;
            } else {
                startFrom = parseInt(startFrom);
            }

            const start = what(isPositive, startFrom, startFromProperty);
            startFrom = start.startFrom;
            const startFromMember = start.startFromMember;

            replacer.replace(comment, '// @tsm fixed: ' + 
                (isPositive > 0 ? 'positive ' : 'negative ') +
                startFrom +
                (startFromProperty ? ' ' + startFromProperty : '')
            )
            if (startFromMember)
                replacer.replace(startFromMember, startFromProperty + ' = ' + startFrom)

            return true;
        }

        if (ts.isEnumDeclaration(node)) {
            getTsmCommands(ts, source, node)
                .cmd('fixed', process(processEnum))
                .run();
        } else if (ts.isVariableStatement(node)) {
            getTsmCommands(ts, source, node)
                .cmd('fixed', process(processVariable))
                .run();
        }

        return ts.forEachChild(node, visitor);
    }

    visitor(sourceFile);
    
    return replacer.stringify();
}
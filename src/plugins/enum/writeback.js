"use strict"
/*

    Write back feeds source files with demanded information and data 

*/


const Replacer = require('../../utils/Replacer');

const getTsmDirective = (ts, source, node, callback) => {
    return ts.getLeadingCommentRanges(source, node.pos).some(comment => {
        let text = source.substring(comment.pos, comment.end);
        if (!text.startsWith('//')) return;
        // const eol = text.indexOf('\n');
        // if (eol < 0) return;
        // text = text.substring(2, eol);
        text = text.substr(2).trim();
        if (!text.startsWith('@tsm:')) return;
        text = text.substr(5).trim();
    
        const params = text.split(/\s+/);
        params.unshift(comment)
        callback.apply(undefined, params);
    
        return true;    
    });
}



module.exports = (source, ts, filePath, {env}) => {

    const sourceFile = ts.createSourceFile(
        filePath,
        source,
        ts.ScriptTarget.ES2015,
        /*setParentNodes */ true
    );

    const replacer = Replacer(source);

    function visitor(node) {

        if (ts.isEnumDeclaration(node)) {
            getTsmDirective(ts, source, node, (comment, isFixed, isPositive, startFrom, startFromProperty) => {

                if (isFixed !== 'fixed') return;
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

                replacer.replace(comment, '// @tsm: fixed ' + 
                    (isPositive > 0 ? 'positive ' : 'negative ') +
                    startFrom +
                    (startFromProperty ? ' ' + startFromProperty : '')
                )
                if (startFromMember)
                    replacer.replace(startFromMember, startFromProperty + ' = ' + startFrom)
            })
        } 

        return ts.forEachChild(node, visitor);
    }

    visitor(sourceFile);
    
    return replacer.stringify();
}
"use strict"
/*

    Write back feeds source files with demanded information and data 

*/


const Replacer = require('../../utils/Replacer');
const crypto = require('crypto');

const { getTranslations, saveTranslations } = require('./translationFiles');

const transformation = (ts, replacer, node, translations) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateExpression(node) ) {
        const text = node.getText();

        if (text.substr(1).startsWith('\\i:')) {
            const uid = crypto.randomBytes(12).toString('base64');
            const newText = text.substr(0, 3) + uid + text.substr(3);
            replacer.replace(node, newText);
            // if (translations.list[uid]) throw new Error(`Translation for ${uid} (${text}) already exist!`)
            translations.list[uid] = {
                lang: translations.default,
                val: text[0] + text.substr(4),
                status: 'new',
                list: {}
            }
        }
    }
}


module.exports = (source, ts, filePath, {env}) => {
    const translations = getTranslations(filePath);

    if (translations) {
        const sourceFile = ts.createSourceFile(
            filePath,
            source,
            ts.ScriptTarget.ES2015,
            /*setParentNodes */ true
        );
    
        const replacer = Replacer(source);
    
        function visitor(node) {
            transformation(ts, replacer, node, translations);
            return ts.forEachChild(node, visitor);
        }
    
        visitor(sourceFile);

        saveTranslations(translations);
        
        return replacer.stringify();
    }

    return source;
}
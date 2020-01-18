"use strict"
/*

    Write back feeds source files with demanded information and data 

*/

const Replacer = require('../../utils/Replacer');
const { getTranslations, saveTranslations } = require('./translationFiles');




const transformation = (ts, replacer, node, translations, language) => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateExpression(node) ) {
        const text = node.getText();
        
        if (text.substr(1).startsWith('\\i\\l:')) {
            const newText = text[0] + language + text.substr(6);
            replacer.replace(node, newText); 
        } else if (text.substr(1).startsWith('\\i') && text.indexOf(':', 3) === 19) {
            const uid = text.substring(3, 19);
            const currentText = text[0] + text.substr(20);
            let newText;

            if (translations.list) {
                const translation = translations.list[uid];
                if (translation) {
                    const translationList = translation.list;
                    let currentTextInTranslations = translation.val;

                    if (currentTextInTranslations !== currentText) {
                        if (Object.keys(translationList).length) {
                            if (translation.valPrevious === undefined) {
                                translation.valPrevious = currentTextInTranslations;
                            }
                            translation.status = 'modified';    
                        }
                        currentTextInTranslations = translation.val = currentText;
                    }


                    if (translation.lang === language) {
                        newText = currentTextInTranslations;
                    } else if (translationList) {
                        const element = translationList[language];
                        if (element) {
                            newText = element.val;
                        }            
                    }
                }
            }
        
            if (newText !== undefined) {
                replacer.replace(node, newText); 
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
        const language =  env.TSM_LANG || translations.default || 'en';
        function visitor(node) {
            transformation(ts, replacer, node, translations, language);
            return ts.forEachChild(node, visitor);
        }
    
        visitor(sourceFile);

        saveTranslations(translations);
        
        return replacer.stringify();
    }

    return source;
}
"use strict"

const findup = require('../../utils/findup')
const readJson = require('../../utils/readJson')
const writeJson = require('../../utils/writeJson')


const files = {};
const filesByContent = new Map();
const filesAwaitingToSave = {};



const getTranslations = (currentPath) => {
    const packageFile = findup('package.json', currentPath, true);
    if (packageFile) {
        const translationsFile = packageFile.getFilePath('translations.json');
        if (translationsFile) {

            if (files[translationsFile]) return files[translationsFile];
            const translations = files[translationsFile] = readJson(translationsFile);
            filesByContent.set(translations, translationsFile);

            if (!translations.default) translations.default = 'en';
            if (!translations.languages) translations.languages = [];
            if (!translations.list) translations.list = {};

            return translations;
        }
    }
}

const saveTranslations = (translations) => {
    const path = filesByContent.get(translations);
    if (path) {
        if (filesAwaitingToSave[path] !== undefined) {
            clearTimeout(filesAwaitingToSave[path]);
        }

        filesAwaitingToSave[path] = setTimeout(() => {
            writeJson(path, translations);
            delete filesAwaitingToSave[path];
        }, 200)
    }
}


module.exports = {
    getTranslations,
    saveTranslations
}
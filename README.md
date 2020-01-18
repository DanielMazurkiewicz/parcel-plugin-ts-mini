# parcel-plugin-ts-mini

This library is a replacement of parcel native Typescript support. It extends functionality by providing additional languague features, like translations or unique identifiers

# Translations

Translations make use of redundant unused escape character \i (backslash i). All you have to do is to tag a string that has to be translated with sequence \i:

Example:
```javascript

const someText = "\i:That text will be translated";

```

During compilation that will automatically add unique identifier for that text and will save that text to a translations.json file.

NOTE: If you'll want to port this way of translations use a name 'tsmLang' for it.


## File translations.json

In order to be able to use translations you have to place translations.json file in root directory of your project. At minimum file has to contain an empty object.

```javascript
{
    "default": "en", // a languague for strings in your code
    "languages": [   // a list of languages that you expect your app or lib to be translated to
        "pl",
        "de",
        "es"
    ],
}
```

ISO639 is used as standard for languague encoding

## Compilation with selected languague

Currently only static compilation is supported and that means that for every app you'll have separate executables with statically included translations. To select languague you have to set envirionment variable TSM_LANG to desired languague code.

```sh
    TSM_LANG=es parcel src-fe/index.html --out-dir dst/fe-dev
```

You can also get a languague code in your source code by placing \i\l: at begining of string:

```javascript
const langCode = '\i\l:';

```
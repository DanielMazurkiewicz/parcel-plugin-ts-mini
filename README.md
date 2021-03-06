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

# Fixed enumeration

If you need numbers automaticly assigned to enumeration elements in a way that they will not change their value upon adding or removal or order change of enumeration elements then add something like this to your enum code:

```javascript
// @tsm fixed:
enum MyEnumeration {
    SOMETHING
}

```

You can also define optionally a direction of numbering and starting number:

```javascript
// @tsm fixed: positive 5
enum MyEnumeration1 {
    SOMETHING
}

// @tsm fixed: negative
enum MyEnumeration2 {
    SOMETHING
}

```

Starting number is automatically updated and always points next value that will be used upon adding new element. Starting number can be also passed to selected enumeration element:

```javascript
// @tsm fixed: positive 5 NAME_FOR_STARTING_NUMBER
enum MyEnumeration1 {
    SOMETHING,
    
    NAME_FOR_STARTING_NUMBER
}
```

## Fixed enumeration for variables and constants

Fixed enumeration works also for constants and variables, in this case every element with "NaN" value will be assigned automatically a new value

```javascript
// @tsm fixed: negative -5 ERROR__$COUNT
export const
    ERROR__$COUNT = -5,
    ERROR__SUCCESS = NaN,
    ERROR__NOT_IMPLEMENTED = -1,
    ERROR__FAIL = -2;

```
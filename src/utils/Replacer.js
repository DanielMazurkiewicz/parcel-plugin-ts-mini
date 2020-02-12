const getStart = element => element.getStart ? element.getStart() : element.pos;
const getWidth = element => element.getWidth ? element.getWidth() : element.end - element.pos;


module.exports = (source) => {
    const list = [];
    return {
        replace: (toReplace, newString) => {
            list.push({ toReplace, newString });
        },
        addBehind: (element, newString) => {
            list.push({ toReplace: {pos: element.end, end: element.end}, newString });
        },
        stringify: () => {
            if (!list.length) return source;
            const sorted = list.sort((a, b) => getStart(a.toReplace) - getStart(b.toReplace));
            const chunks = [];
            let start = 0;
            sorted.forEach(({toReplace, newString}) => {
                // console.log('=========================----------============')
                chunks.push(source.substring(start, getStart(toReplace)));
                // console.log(start, toReplace.getStart(), source.substring(start, toReplace.getStart()))
                // console.log('---------- OLD:')
                // chunks.push(source.substr(toReplace.getStart(), toReplace.getWidth())); // old string
                // console.log(source.substr(toReplace.getStart(), toReplace.getWidth())); // old string
                // console.log('---------- NEW:')
                // console.log(newString)
                chunks.push(newString);
                start = getStart(toReplace) + getWidth(toReplace);
            })
            chunks.push(source.substring(start));
            return chunks.join('');
        }
    }
}

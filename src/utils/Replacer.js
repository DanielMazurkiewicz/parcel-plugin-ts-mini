module.exports = (source) => {
    const list = [];
    return {
        replace: (toReplace, newString) => {
            list.push({ toReplace, newString });
        },
        stringify: () => {
            if (!list.length) return source;
            const sorted = list.sort((a, b) => a.toReplace.getStart() - b.toReplace.getStart());
            const chunks = [];
            let start = 0;
            sorted.forEach(({toReplace, newString}) => {
                // console.log('=========================----------============')
                chunks.push(source.substring(start, toReplace.getStart()));
                // console.log(start, toReplace.getStart(), source.substring(start, toReplace.getStart()))
                // console.log('---------- OLD:')
                // chunks.push(source.substr(toReplace.getStart(), toReplace.getWidth())); // old string
                // console.log(source.substr(toReplace.getStart(), toReplace.getWidth())); // old string
                // console.log('---------- NEW:')
                // console.log(newString)
                chunks.push(newString);
                start = toReplace.getStart() + toReplace.getWidth();
            })
            chunks.push(source.substring(start));
            return chunks.join('');
        }
    }
}

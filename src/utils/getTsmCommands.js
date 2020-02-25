// module.exports = (ts, source, node, callback) => {
//     return ts.getLeadingCommentRanges(source, node.pos).some(comment => {
//         let text = source.substring(comment.pos, comment.end);
//         if (!text.startsWith('//')) return;
 
//         text = text.substr(2).trim();
//         if (!text.startsWith('@tsm')) return;
//         text = text.substr(4);

//         const eoc = text.indexOf(':');
//         if (eoc < 0) return;

    
//         const params = text.split(/\s+/);
//         params.unshift(comment)
//         return callback.apply(undefined, params);    
//     });
// }



module.exports = (ts, source, node) => {
    const commands = {}

    const me = {
        cmd: (command, callback) => {
            commands[command] = callback;
            return me;
        },
        run: () => {
            const commentRanges = ts.getLeadingCommentRanges(source, node.pos)
            
            return commentRanges && commentRanges.some(comment => {
                let text = source.substring(comment.pos, comment.end);
                if (!text.startsWith('//')) return;

                text = text.substr(2).trim();
                if (!text.startsWith('@tsm ')) return;
                text = text.substr(5);

                const eoc = text.indexOf(':');
                if (eoc < 0) return;

                const command = text.substring(0, eoc).trim();
                if (!commands[command]) return;

                text = text.substr(eoc + 1).trim();

                const params = text.split(/\s+/);
                params.unshift(comment);

                return commands[command].apply(undefined, params);    
            })
        }
    }

    return me;
}

const codePenReg = /\[{3}.*\]{3}/;

module.exports = function (md, config) {

    // https://github.com/markdown-it/markdown-it/blob/28cec6d30a5b18ded43d595ed24ba7a095ed859f/lib/rules_block/state_block.js
    md.block.ruler.before('table', 'codePen', function (state, startLine, endLine, silent) {

        let lineSource = state.getLines(startLine, startLine + 1, state.sCount[startLine], true),
            match = lineSource.match(codePenReg);

        if (match) {

            state.line++;

            token = state.push('codePen', 'p', 0);
            token.content = lineSource;
            token.map = [startLine, state.line];

        }

        return !!match;

    });

    md.renderer.rules.codePen = function (tokens, idx, options, env, slf) {

        let token = tokens[idx];

        console.log(arguments);
    };

}
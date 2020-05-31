const codePenReg = /\[{3}pen(.*)\]{3}/;

// height
// theme-id
// default-tab
// user
// slug-hash
// pen-title
const generateHtml = function (dataset, injectScript) {

    let attrStr = '',
        user,
        slugHash,
        penTitle;

    for(let attr of dataset) {

        if (attr[0] === 'user') user = attr[1];

        if (attr[0] === 'slug-hash') slugHash = attr[1];

        if (attr[0] === 'pen-title') penTitle = attr[1];

        attrStr += `data-${attr[0]}="${attr[1]}"`;

    }

    return `
        <p class="codepen" ${attrStr} style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;">
            <span>See the Pen <a href="https://codepen.io/${user}/pen/${slugHash}">
            ${penTitle}</a> by ${user} (<a href="https://codepen.io/${user}">@${user}</a>)
            on <a href="https://codepen.io">CodePen</a>.</span>
        </p>
        ${injectScript ? '<script async src="https://static.codepen.io/assets/embed/ei.js"></script>' : ''}
    `;

}

module.exports = function (md, config) {

    let injectScript = true;

    // https://github.com/markdown-it/markdown-it/blob/28cec6d30a5b18ded43d595ed24ba7a095ed859f/lib/rules_block/state_block.js
    md.block.ruler.before('table', 'codePen', function (state, startLine, endLine, silent) {

        let lineSource = state.getLines(startLine, startLine + 1, state.sCount[startLine], true),
            match = lineSource.match(codePenReg);

        if (state.line === 0) injectScript = true;

        if (match) {

            state.line++;

            token = state.push('codePen', 'p', 0);
            token.content = match[1];
            token.map = [startLine, state.line];

        }

        return !!match;

    });

    md.renderer.rules.codePen = function (tokens, idx, options, env, slf) {

        let token = tokens[idx],
            attrs = token.content.trim().split(' ').map(attr => attr.split('=').map(item => item.replace(/['|"]*/g, ''))),
            html = generateHtml(attrs, injectScript);

        // 避免重复插入script
        injectScript = false;

        return html;

    };

}
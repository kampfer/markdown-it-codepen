const MarkdownIt = require('markdown-it');
const fs = require('fs');
const codepenPlugin = require('../src/index');

const md = new MarkdownIt({
    html: true
});

md.use(codepenPlugin);

const file = fs.readFileSync('./test/test.md');

fs.writeFileSync('./test/test.html', md.render(file.toString()));

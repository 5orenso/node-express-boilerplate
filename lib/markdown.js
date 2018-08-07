/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2018 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

const marked = require('marked');

const renderer = new marked.Renderer();

// Markdown settings
marked.setOptions({
    highlight(code) {
        // eslint-disable-next-line
        return require('highlight.js').highlightAuto(code).value;
    },
});
renderer.heading = function heading(text, level) {
    const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
    return `<h${level} class="toc-${level}"><a name="${
        escapedText
    }" class="anchor" href="#${
        escapedText
    }"><span class="header-link"></span></a>${
        text}</h${level}>`;
};

renderer.image = function image($href, title, text) {
    const src = $href;
    const href = $href.replace(/(w=[0-9]+)/, 'w=1800');
    const mediaClass = [];
    const result = src.match(/#([a-z,]+)$/);
    if (result) {
        const allClasses = result[1].split(',');
        for (let i = 0, l = allClasses.length; i < l; i += 1) {
            mediaClass.push(allClasses[i]);
        }
    }
    return `<p class="image_inline ${mediaClass.join(' ')}"><a href="${href}" data-smoothzoom="group1" title="${title
        || text}"><img src="${src}" alt="${text}" title="${title || text}">`
        + `</a><span class="image_inline_text">${title || text}</span></p>`;
};
// /Markdown settings

class Markdown {
    static render(data) {
        const markdownData = marked(data.toString(), { renderer });
        return markdownData;
    }
}
module.exports = Markdown;

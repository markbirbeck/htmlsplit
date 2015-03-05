/**
 * The basic idea is to concatenate all lines of text in the HTML document,
 * and whilst doing so add our own markers based on the tags. Then we can
 * split apart the lines again based on the markers.
 */

var cheerio = require('cheerio');

var LINE_BREAK = '*CRLF*';

function mergeElements($node, $, debug) {
  return $node.contents().map(function() {
    var tmp;

    /**
     * Elements that need a space adding to them:
     */

    var addSpace = [
      'dt', 'wbr'
    ];

    /**
     * Elements that need a line feed after them:
     */

    var block = [
      'address',
      'article',
      'aside',
      'blockquote',
      'br',
      'div',
      'dd',
      'details',
      'figcaption',
      'figure',
      'footer',
      'header',
      'h',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'hr',
      'li',
      'main',
      'nav',
      'p',
      'section',
      'summary',
      'table',
      'tbody',
      'tfoot',
      'thead',
      'title',
      'tr'
    ];

    /**
     * Elements to ignore.
     *
     * Note that it's best to only disable elements that definitely can't
     * contain further information. For example, it's tempting to add <form>
     * but some sites have the entire page contained within a <form>:
     */

    var skipElements = [
      'area',
      'audio',
      'button',
      'canvas',
      'datalist',
      'embed',
      // 'fieldset',
      // 'form',
      'iframe',
      'img',
      'input',
      'keygen',
      // 'label',
      'link',
      'map',
      'menu',
      'menuitem',
      'meta',
      'meter',
      'noscript',
      'object',
      'optgroup',
      'option',
      'output',
      'param',
      'picture',
      'progress',
      'script',
      'select',
      'source',
      'style',
      'template',
      'textarea',
      'track',
      'video'
    ];

    /**
     * Skip comments:
     */

    if ([8].indexOf(this.nodeType) > -1) {
      return;
    }

    /**
     * If we have a text node then just return the value:
     */

    if (this.nodeType === 3) {
      return this.nodeValue;
    }

    /**
     * Skip elements:
     */

    if (skipElements.indexOf(this.tagName) > -1) {
      return;
    }

    /**
     * Append a space:
     */

    if (addSpace.indexOf(this.tagName) > -1) {
      tmp = mergeElements($(this), $, debug);

      if (debug) {
        tmp.push('*SPACE ' + this.tagName + '*');
      }
      tmp.push(' ');
      return tmp;
    }

    /**
     * Append a line break to all block level elements:
     */

    if (block.indexOf(this.tagName) > -1) {
      tmp = mergeElements($(this), $, debug);

      if (debug) {
        tmp.push('*BLOCK ' + this.tagName + '*');
      }
      tmp.push(LINE_BREAK);
      return tmp;
    }

    /**
     * Finally, recurse:
     */

    tmp = mergeElements($(this), $);

    if (debug) {
      tmp.push('*BLOCK ' + this.tagName + '*');
    }
    return tmp;
  }).get();
}

var htmlSplit = function(s, debug) {
  var $ = cheerio.load(s);

  return mergeElements($.root(), $, debug)

    /**
     * Merge all of the components:
     */

    .join('')

    /**
     * Split them again, using our own line break markers:
     */

    .split(LINE_BREAK)

    /**
     * Collapse sequences of whitespace to a single space:
     */

    .map(function(t) { return t.replace(/[\s\uFEFF\xA0]+/g, ' ').trim(); })

    /**
     * Strip blank lines:
     */

    .filter(function(t) { return t !== ''; });
};

module.exports = htmlSplit;

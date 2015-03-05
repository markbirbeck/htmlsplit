require('should');
var htmlSplit = require('..');

describe('blocks', function() {
  var output = [
    'Term Starts: Wednesday 7 January 2015',
    'Term Ends: Friday 27 March 2015'
  ];

  describe('should split on', function() {
    describe('elements that wrap', function() {
      [
        'address', 'article', 'aside', 'blockquote', 'details', 'div',
        'figcaption', 'figure', 'footer', 'header', 'h', 'h1', 'h2', 'h3',
        'h4', 'h5', 'h6', 'main', 'nav', 'p', 'section', 'summary'
      ].map(function(tag) {
        var open = '<' + tag + '>';
        var close = '</' + tag + '>';

        it(open, function() {
          htmlSplit(
            [
              open + 'Term Starts: Wednesday 7 January 2015' + close,
              open + 'Term Ends: Friday 27 March 2015' + close
            ].join('')
          ).should.eql(output);
        });
      });

      it('<li>', function() {
        htmlSplit(
          [
            '<ul>',
            '  <li>Term Starts: Wednesday 7 January 2015</li>',
            '  <li>Term Ends: Friday 27 March 2015</li>',
            '</ul>'
          ].join('')
        ).should.eql(output);
      });

      it('<title>', function() {
        htmlSplit(
          [
            '<html>',
            '  <head>',
            '    <title>Term Starts: Wednesday 7 January 2015</title>',
            '  </head>',
            '  <body>',
            '    <p>Term Ends: Friday 27 March 2015</p>',
            '  </body>',
            '</html>'
          ].join('')
        ).should.eql(output);
      });

      it('<tr>', function() {
        htmlSplit(
          [
            '<table>',
            '  <tr><td>Term Starts: Wednesday 7 January 2015</td></tr>',
            '  <tr><td>Term Ends: Friday 27 March 2015</td></tr>',
            '</table>'
          ].join('')
        ).should.eql(output);
      });
    });

    describe('elements with no content', function() {
      [
        'br', 'hr'
      ].map(function(tag) {
        tag = '<' + tag + '>';

        it(tag, function() {
          htmlSplit(
            [
              '<div>',
              '  Term Starts: Wednesday 7 January 2015' + tag,
              '  Term Ends: Friday 27 March 2015' + tag,
              '</div>'
            ].join('')
          ).should.eql(output);
        });
      });
    });
  });

  describe('should NOT split on', function() {
    [
      'a', 'abbr', 'b', 'bdi', 'bdo', 'cite', 'code', 'data', 'del', 'dfn',
      'em', 'i', 'ins', 'kbd', 'mark', 'q', 'rb', 'rt', 'rtc', 'rp', 'ruby',
      's', 'samp', 'small', 'span', 'strong', 'sub', 'sup', 'time', 'u', 'var'
    ].map(function(tag) {
      var open = '<' + tag + '>';
      var close = '</' + tag + '>';

      it(open, function() {
        htmlSplit(
          [
            open + 'Term Starts:' + close + ' Wednesday 7 January 2015<br>',
            open + 'Term Ends:'  + close + ' Friday 27 March 2015<br>'
          ].join('')
        ).should.eql(output);
      });
    });

    it('<td>', function() {
      htmlSplit(
        [
          '<table>',
          '  <tr>',
          '    <td>Term Starts:</td>',
          '    <td>Wednesday 7 January 2015</td>',
          '  </tr>',
          '  <tr>',
          '    <td>Term Ends:</td>',
          '    <td>Friday 27 March 2015</td>',
          '  </tr>',
          '</table>'
        ].join('')
      ).should.eql(output);
    });
  });
});

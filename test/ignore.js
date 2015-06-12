require('chai').should();
var htmlSplit = require('..');

describe('ignore', function() {
  var output = [
    'Term Starts: Wednesday 7 January 2015',
    'Term Ends: Friday 27 March 2015'
  ];

  describe('should not bother processing', function() {
    [
      'button', 'menu', 'menuitem', 'script', 'select', 'style', 'template'
    ].map(function(tag) {
      var open = '<' + tag + '>';
      var close = '</' + tag + '>';

      it(open, function() {
        htmlSplit(
          [
            '<div>Term Starts: Wednesday 7 January 2015</div>',
            open + 'This should not get through' + close,
            '<div>Term Ends: Friday 27 March 2015</div>'
          ].join('')
        ).should.eql(output);
      });
    });

    it('comments', function() {
      htmlSplit(
        [
          '<div>Term Starts: Wednesday 7 January 2015</div>',
          '<!-- This should not get through -->',
          '<div>Term Ends: Friday 27 March 2015</div>'
        ].join('')
      ).should.eql(output);
    });
  });
});

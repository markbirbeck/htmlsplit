require('chai').should();
var htmlSplit = require('..');

describe('flow', function() {
  it('should ignore newlines within tags', function() {
    htmlSplit('<span>line\n</span><span>\r1\r</span>')
      .should.eql(['line 1']);
  });
});

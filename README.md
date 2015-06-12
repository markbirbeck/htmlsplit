# htmlsplit

[![wercker status](https://app.wercker.com/status/1bd160abd66972292d815248f10e6bc7/m/master "wercker status")](https://app.wercker.com/project/bykey/1bd160abd66972292d815248f10e6bc7)

`htmlsplit` splits HTML documents into lines that hopefully reflect the intent of the author.

## Introduction

A web page may have the following layout:

```
Term Starts: Wednesday 7 January 2015
Term Ends: Friday 27 March 2015
```

However, there is a wide range of markup that could achieve this layout. For example, we could have a `<div>` that contains lines with `<br>` tags:

```
<div>
  Term Starts: Wednesday 7 January 2015<br>
  Term Ends: Friday 27 March 2015<br>
</div>
```

Alternatively, each line could be its own `<div>`:

```
<div>Term Starts: Wednesday 7 January 2015</div>
<div>Term Ends: Friday 27 March 2015</div>
```

a line in a list:

```
<ul>
  <li>Term Starts: Wednesday 7 January 2015</li>
  <li>Term Ends: Friday 27 March 2015</li>
</ul>
```

or a row in a `<table>`:

```
<table>
  <tr><td>Term Starts: Wednesday 7 January 2015</td></tr>
  <tr><td>Term Ends: Friday 27 March 2015</td></tr>
</table>
```

And of course when using tables, each row could itself be split into columns:

```
<table>
  <tr>
    <td>Term Starts:</td>
    <td>Wednesday 7 January 2015</td>
  </tr>
  <tr>
    <td>Term Ends:</td>
    <td>Friday 27 March 2015</td>
  </tr>
</table>
```

Authors could also mark up different parts of each line with flow tags:

```
<b>Term Starts:</b> Wednesday 7 January 2015<br>
<b>Term Ends:</b> Friday 27 March 2015<br>
```

The key point is that whitespace in the *markup* does not give us any clues as to the intent of the page author. For example, whether the table example above has each table cell marked up a seperate line, or has each row (and all its cells) on the same line, makes no difference to how the markup is rendered.

The purpose of `htmlsplit` therefore is to try to capture this intent, when splitting an HTML document into lines for processing.

## Usage

The module provides a single function, which does the splitting:

```
var htmlSplit = require('htmlsplit');
```

The function takes a string as input, and returns an array of lines

```
htmlSplit(
  [
    '<div>Term Starts: Wednesday 7 January 2015</div>',
    '<!-- This should not get through -->',
    '<div>Term Ends: Friday 27 March 2015</div>'
  ].join('')
).should.eql([
  'Term Starts: Wednesday 7 January 2015',
  'Term Ends: Friday 27 March 2015'
]);
```

The function can also take a second parameter which if `true` will add debug information to the output.

## Changelog

### 2015-06-12 (v1.1.0)

Add a space between adjacent table cells. (Fixes #1)

Upgrade `mocha`, and replace `should` with `chai`.

### 2015-03-05 (v1.0.0)

Initial release.
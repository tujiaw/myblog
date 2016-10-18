'use strict';

var fs = require('fs');
var cheerio = require('cheerio');
var path = require('path');
var ejs = require('ejs');
var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();

var indexPath = path.normalize('../index.html');
var dstDir = path.normalize('../view/blog');
var detailPath = path.normalize('../view/blog/template/detail.html');

var $index = cheerio.load(fs.readFileSync(indexPath, 'utf8'));
$index('section').empty();
var $detail = cheerio.load(fs.readFileSync(detailPath, 'utf8'));
$detail('section').empty();

var titlePathList = [];

var dirs = fs.readdirSync(dstDir, 'utf8');
dirs.sort((a, b) => { return b - a; });
dirs.forEach((dir) => {
  var fd = fs.openSync(path.join(dstDir, dir), 'r');
  var stat = fs.fstatSync(fd);
  if (stat.isDirectory() && dir != 'template') {
    var titlePath = path.join(dstDir, dir, 'title.json');
    var contentPath = path.join(dstDir, dir, 'content.md');
    var title = handleTitle(titlePath);
    handleContent(title, contentPath);
  } else if (stat.isFile()) {
    console.log('is file:' + path.join(dstDir, dir));
  } else {
    console.log('unkown:' + path.join(dstDir, dir));
  }
});

fs.writeFile(indexPath, $index.html(), 'utf8', (err) => {
  if (err) {
    console.error(err);
  } else {
    console.log('update index.html success:' + indexPath);
  }
});

function handleTitle(titlePath) {
  var title = JSON.parse(fs.readFileSync(titlePath, 'utf8'));
  title.content = title.brief;
  var contentDir = path.resolve('./view', path.dirname(titlePath));
  var relativeDir = path.relative('.', contentDir);
  var url = relativeDir.split('\\').join('/')
  title.url = url + '/detail.html';
  var html = ejs.render($index('#article').html(), title);
  $index('section').append(html);
  return title;
}

function handleContent(title, contentPath) {
  var curDirName = path.basename(path.dirname(contentPath));
  title.content = md.render(fs.readFileSync(contentPath, 'utf8'));
  var article = ejs.render($detail('#articleTempl').html(), title);
  var duoshuoData = {
    "dataThreadKey": curDirName,
    "dataTitle": title.title,
    "dataUrl": 'http://tujiaw.github.io/view/blog/' + curDirName + '/detail.html'
  };
  var duoshuo = ejs.render($detail('#duoshauoTempl').html(), duoshuoData);
  $detail('section').empty();
  $detail('section').append(article);
  $detail('#duoshuo').html(duoshuo);
  var dstDetailPath = path.join(path.dirname(contentPath), 'detail.html');
  fs.writeFile(dstDetailPath, $detail.html(), 'utf8', (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log('update detail.html success:' + dstDetailPath);
    }
  });
}

'use strict';

var fs = require('fs');
var path = require('path');

var blogDir = path.normalize('../view/blog');

function leftPad(str, count) {
    return Array(Math.max(0, count - ('' + str).length + 1)).join(0) + str;
}

function curDate() {
    var date = new Date();
    return leftPad(date.getFullYear(), 4) + 
          leftPad(date.getMonth() + 1, 2) +
          leftPad(date.getDate(), 2) +
          leftPad(date.getHours(), 2) +
          leftPad(date.getMinutes(), 2) +
          leftPad(date.getSeconds(), 2);
}

function formateDate(date) {
    return date.slice(0, 4) + '/' +
        date.slice(4, 6) + '/' +
        date.slice(6, 8) + ' ' +
        date.slice(8, 10) + ':' +
        date.slice(10, 12) + ':' +
        date.slice(12);
}

var curDate = curDate();
var dstDir = path.join(blogDir, curDate);
fs.access(dstDir, fs.R_OK | fs.W_OK, (err) => {
    if (err) {
       fs.mkdir(dstDir);
       var titleJson = path.join(blogDir, curDate, 'title.json');
       var contentMd = path.join(blogDir, curDate, 'content.md');
       var titleTempl = '{\n "type": "",\n "title": "",\n "brief": "",\n "date": "formateDate"\n }';
       titleTempl = titleTempl.replace(/formateDate/, formateDate(curDate));

       console.log('new dir:' + dstDir);
       fs.writeFile(titleJson, titleTempl, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('init title.json ok');
        }
       });
       fs.writeFile(contentMd, '## ', (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('init content.md ok');
        }
       });
    } else {
        console.log('exist!');
        return;
    }
});




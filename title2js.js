#!/usr/bin/env node
'use strict';
// Converts the titles.dat file into a valid js file
var fs = require('fs');


var titles = fs.readFileSync('./titles.dat', 'utf8');

var file_format = 'module.exports = "';

titles.split('\n').forEach((title) => {
  file_format += `${title}\\n\\\n`;
});

file_format += '";\n';

fs.writeFileSync('./titles.js', file_format);

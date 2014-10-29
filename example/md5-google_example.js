/*jslint node: true */
'use strict';

var md5Google = require('../lib/md5-google.js');

md5Google.decrypt('f20f8505ac09ae2fe6fe2e68976e80e4')
.then(function (results) {
    console.log(results);
})
.catch(function (reason) {
    console.error(reason);
})
.done();
console.log();
md5Google.decrypt.all('f20f8505ac09ae2fe6fe2e68976e80e4')
.then(function (results) {
    console.log(results);
})
.catch(function (reason) {
    console.error(reason);
})
.done(function () {
    console.log();
});
/*jslint node: true */
/*global describe, it, before */
'use strict';
var assert = require('assert'),
    md5Google = require('../lib/md5-google.js');

describe('md5-google node module.', function () {
    describe('#decrypt("f20f8505ac09ae2fe6fe2e68976e80e4")', function () {
        var md5Results,
            fulfilledHostnames = ['www.md5-hash.com', 'md5.db30.com', 'md5-online.ru', 'de.md5decoder.org', 'www.md5center.com', 'md5info.ru', 'md5this.com'],
            rejectedHostnames = ['www.filehash.info'],
            hostnamesCount = fulfilledHostnames.length + rejectedHostnames.length;
        
        before(function () {
            return md5Google.decrypt('f20f8505ac09ae2fe6fe2e68976e80e4')
            .then(function (results) {
                md5Results = results;
            });
        });
        
        fulfilledHostnames.forEach(function (hostname) {
            it('should return "logica" with "' + hostname + '" website', function () {
                var result = md5Results[hostname];
                assert.equal(result.state, 'fulfilled', JSON.stringify(result));
                assert.equal(result.value, 'logica', JSON.stringify(result));
            });
        });
        
        rejectedHostnames.forEach(function (hostname) {
            it('should not find MD5 parser for "' + hostname + '" website', function () {
                var result = md5Results[hostname];
                assert.equal(result.state, 'rejected', JSON.stringify(result));
                assert.equal(result.reason, 'No MD5 parser found', JSON.stringify(result));
            });
        });
        
        it('sould return ' + hostnamesCount.length + ' results', function () {
            assert.equal(Object.keys(md5Results).length, hostnamesCount);
        });
    });
});

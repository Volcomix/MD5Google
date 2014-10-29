/*jslint node: true */
/*global describe, it, before */
'use strict';
var assert = require('assert'),
    md5Google = require('../lib/md5-google.js');

describe('md5-google node module.', function () {
    
    function testDecrypt(md5, expected, fulfilledHostnames, rejectedHostnames, only) {
        var describeFunc = only ? describe.only : describe;
        describeFunc('#decrypt("' + md5 + '")', function () {
            var md5Results,
                hostnamesCount = fulfilledHostnames.length + rejectedHostnames.length;

            before(function () {
                return md5Google.decrypt(md5)
                .then(function (results) {
                    md5Results = results;
                });
            });

            fulfilledHostnames.forEach(function (hostname) {
                it('should return "' + expected + '" with "' + hostname + '" website', function () {
                    var result = md5Results[hostname];
                    assert.equal(result.state, 'fulfilled', JSON.stringify(result, null, 4));
                    assert.equal(result.value, expected, JSON.stringify(result, null, 4));
                });
            });

            rejectedHostnames.forEach(function (hostname) {
                it('should not find MD5 parser for "' + hostname + '" website', function () {
                    var result = md5Results[hostname];
                    assert.equal(result.state, 'rejected', JSON.stringify(result, null, 4));
                    assert.equal(result.reason, 'No MD5 parser found', JSON.stringify(result, null, 4));
                });
            });

            it('sould return ' + hostnamesCount + ' results', function () {
                assert.equal(Object.keys(md5Results).length, hostnamesCount, JSON.stringify(md5Results, null, 4));
            });
        });
    }
    
    testDecrypt.only = function (md5, expected, fulfilledHostnames, rejectedHostnames) {
        testDecrypt(md5, expected, fulfilledHostnames, rejectedHostnames, true);
    };
    
    testDecrypt(
        'f20f8505ac09ae2fe6fe2e68976e80e4',
        'logica',
        ['www.md5-hash.com', 'md5.db30.com', 'md5-online.ru', 'de.md5decoder.org', 'www.md5center.com', 'md5info.ru', 'md5this.com'],
        ['www.filehash.info']
    );
    
    testDecrypt(
        '9d0c2b5e15cc600a9828a18a5ffe7dba',
        '123soleil',
        ['md5.znaet.org', 'www.md5this.com'],
        ['forum.antichat.net', 'cegica.googlecode.com', 'www.stafaband.info', 'insidepro.com', 'pastebin.ca', 'paste2.org', 'dopeco.de', 'pastebin.com']
    );
});

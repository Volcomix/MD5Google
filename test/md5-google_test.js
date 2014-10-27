/*jslint node: true */
/*global describe, it */
'use strict';
var assert = require('assert'),
    md5Google = require('../lib/md5-google.js');

describe('md5-google node module.', function () {
    it('must be awesome', function () {
        assert(md5Google.awesome(), 'awesome');
    });
    
    describe('#decrypt', function () {
        it('should decrypt "logica" for each parser excepting "www.filehash.info"', function () {
            assert(md5Google.decrypt('f20f8505ac09ae2fe6fe2e68976e80e4'));
        });
    });
});

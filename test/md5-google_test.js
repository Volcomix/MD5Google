/*global describe,it*/
'use strict';
var assert = require('assert'),
  md5Google = require('../lib/md5-google.js');

describe('md5-google node module.', function() {
  it('must be awesome', function() {
    assert( md5Google.awesome(), 'awesome');
  });
});

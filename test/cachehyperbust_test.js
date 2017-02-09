/*global describe,it*/

'use strict';

var assert = require('assert'),
cachebust = require('../lib/cachehyperbust.js');

describe('cachehyperbust node module.', function () {
  it('must return HTML with query strings appended to asset URLs', function() {
    assert.notEqual(cachehyperbust.busted(), 'awesome');
  });
});

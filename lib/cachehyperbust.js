/*
 *
 * https://github.com/Merk87/gulp-cache-hyper-bust
 *
 * Copyright (c) 2017 Viktor Moreno
 * Licensed under the MIT license.
 *
 */

'use strict';

var cheerio = require('cheerio'),
    fs = require('fs');

function evaluateExclusionClasses(item, excludedClasses) {
  var i = 0;
  for (i; i <= excludedClasses.length; i++) {
    if (item.hasClass(excludedClasses[i])) {
      return false;
    }
  }

  return true;
}

exports.busted = function (fileContents, options) {
  var self = this, $ = cheerio.load(fileContents);

  self.timestamp = function (fileContents, originalAttrValue, options) {
    var phpValue = originalAttrValue.match('(<\?.*\?>.*)');
    if(phpValue != null && phpValue.length > 0){
      var result = fileContents.replace(originalAttrValue, phpValue[1] + '?t=' + options.currentTimestamp);
    }else{
      var originalAttrValueWithoutCacheBusting = originalAttrValue.split("?")[0];
      var result = fileContents.replace(originalAttrValue, originalAttrValueWithoutCacheBusting + '?t=' + options.currentTimestamp);
    }

    return result
  };

  options = {
    basePath: options.basePath || "",
    type: options.type || "timestamp",
    currentTimestamp: new Date().getTime(),
    excludeClass: options.excludeClass || ["no-burst"],
    images: options.images || false
  };

  $('script[src], link[rel=stylesheet][href]').each(function () {
    var originalAttrValue = $(this).is('link') ? $(this).attr('href') : $(this).attr('src');
    // Test for http(s) and don't cache bust if (assumed) served from CDN
    if (evaluateExclusionClasses($(this), options.excludeClass)) {
      fileContents = self[options.type](fileContents, originalAttrValue, options);
    }
  });

  if (options.images) {
    $('img[src]').each(function () {
      var originalAttrValue = $(this).attr('src');
      // Test for http(s) and don't cache bust if (assumed) served from CDN
      if (evaluateExclusionClasses($(this), options.excludeClass)) {
        fileContents = self[options.type](fileContents, originalAttrValue, options);
      }
    });
  }
  return fileContents;
};

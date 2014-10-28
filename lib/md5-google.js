/*jslint node: true */
'use strict';

var url = require('url'),
    request = require('request'),
    cheerio = require('cheerio'),
    Q = require('q');

var md5Parser = {
    'www.md5-hash.com': function ($) {
        return $('strong.result').text();
    },
    'md5.db30.com': function ($) {
        return $('.information h3').text();
    },
    'md5-online.ru': function ($) {
        return $('h1 font[color=red]').text();
    },
    'de.md5decoder.org': function ($) {
        return $('article.top-level h2:not(.top-space)').text();
    },
    'www.md5center.com': function ($, md5) {
        var plain = $('td.snippet:contains("' + md5 + '")').prev().text();
        return plain.substring(5, plain.length - 2);
    },
    'md5info.ru': function ($) {
        return $('.f_val').last().text();
    },
    'md5this.com': function ($, md5) {
        return $('td:contains("' + md5 + '") ~ td').last().text();
    }
};

exports.decrypt = function (md5) {
    var deferred = Q.defer();
    request('https://www.google.com/search?q=' + md5, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var $ = cheerio.load(body),
                urls = [],
                promises = [];
            $('li.g .r a').each(function () {
                var deferred = Q.defer(),
                    href = $(this).data('href') || $(this).attr('href'),
                    md5Url = url.parse(href, true).query.q,
                    md5ParserFunc = md5Parser[url.parse(md5Url).hostname];
                urls.push(md5Url);
                if (md5ParserFunc) {
                    request(md5Url, function (error, response, body) {
                        if (!error && response.statusCode === 200) {
                            var result = md5ParserFunc(cheerio.load(body), md5);
                            if (result) {
                                deferred.resolve(result);
                            } else {
                                deferred.reject('Error while parsing MD5');
                            }
                        } else {
                            deferred.reject(error || 'Error while requesting MD5 URL:\n\n' + JSON.stringify(response));
                        }
                    });
                } else {
                    deferred.reject('No MD5 parser found');
                }
                promises.push(deferred.promise);
            });
            Q.allSettled(promises)
            .then(function (results) {
                var md5results = {};
                results.forEach(function (obj, i) {
                    obj.url = urls[i];
                    md5results[url.parse(obj.url).hostname] = obj;
                });
                deferred.resolve(md5results);
            })
            .done();
        } else {
            deferred.reject(error || 'Error while requesting Google:\n\n' + JSON.stringify(response));
        }
    });
    return deferred.promise;
};
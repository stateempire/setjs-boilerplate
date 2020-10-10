import {getProp} from 'setbp/utility/objects.js';
import pageLoader from 'setbp/kernel/page-loader.js';
import storage, {storageTypes} from 'setbp/kernel/storage.js';
import setup from 'config/setup.js';

export let api = {};

export function addApis(apis) {
  Object.keys(apis).forEach(function(key) {
    if (api[key]) {
      throw key + ' is already defined in api-helper.';
    }
  });
  $.extend(api, apis);
}

export function dataGet(url, opts) {
  ajaxCall($.extend({useData: 1}, opts, {type: 'GET', relativeUrl: url}));
}

export function dataFunc(url) {
  return function(opts) {
    dataGet(url, opts);
  };
}

export function jsonSave(url, type, opts) {
  ajaxCall($.extend({isJSON: 1}, opts, {type, relativeUrl: url}));
}

export function jsonFunc(url, type = 'POST') {
  return function(opts) {
    jsonSave(`${url}${opts.urlSeg || ''}`, type, opts);
  };
}

export function getById(url, id = 'id') {
  return function(opts) {
    dataGet(`${url}/${getProp(id, opts)}`, opts);
  };
}

export function getWithUrlSeg(url) {
  return function(opts) {
    dataGet(`${url}${opts.urlSeg || ''}`, opts);
  };
}

export function saveById(url, id = 'data.uuid') {
  return function(opts) {
    jsonSave(url, getProp(id, opts) ? 'PUT' : 'POST', opts);
  };
}

/**
 * Consolidate Ajax Call
 * @param {Object} opts - The options object
 */
export function ajaxCall(ajaxOpts) {
  var {isJSON, relativeUrl, type, data, success, error, complete} = ajaxOpts;
  var token = storage.get(storageTypes.token);
  var headers = token ? {'Authorization': 'Token ' + token} : null;
  var ajaxSettings = {
    url: setup.apiUrl() + relativeUrl,
    type: type || 'POST',
    headers,
    data,
    success, // res, textStatus, jqXHR
    complete,
    error: function(jqXHR) {
      if (jqXHR.status === 401 && pageLoader.handleAuthError(type, function() { ajaxCall(ajaxOpts); })) {
        return;
      }
      var responseObj = jqXHR.responseJSON || {};
      error && error(responseObj, jqXHR);
    },
  };
  if (isJSON) {
    ajaxSettings.data = typeof data == 'string' ? data : JSON.stringify(data);
    ajaxSettings.contentType = 'application/json';
  }
  $.ajax(ajaxSettings);
}

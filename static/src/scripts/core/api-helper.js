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

/**
 * Consolidate Ajax Call
 * @param {Object} opts - The options object
 */
export function ajaxCall({isJSON, relativeUrl, type, data, success, error, complete}) {
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
      if (jqXHR.status === 401 && pageLoader.handleAuthError(type)) {
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

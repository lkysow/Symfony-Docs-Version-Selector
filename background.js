var DEFAULT_VERSION = "current";
var requiredVersion = DEFAULT_VERSION;
var enabled = true;

/*
 * The first capture group gets everything before the docs version, the second the docs version
 * the third everything after.
 *
 * Notes: - Requests to www.symfony.com will receive a 301 redirect to symfony.com, so only hook into naked domain request
 *        - The .*? after symfony.com is because of localized docs, ex. symfony.com/fr/doc
 */
var docVersionRegex = new RegExp("(http://symfony.com.*?/doc/)(.+?)(/.*)");

var initializeVersion = function () {
  chrome.storage.sync.get("version", function (items) {
    if (items.version) {
      requiredVersion = items.version;
    }
  });
};

var initializeEnabled = function () {
  chrome.storage.sync.get("enabled", function (items) {
    if (items.enabled) {
      enabled = items.enabled;
    }
  });
}

// add listener for when version is updated
var addOptionsChangeListener = function () {
  chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (changes.version) {
      requiredVersion = changes.version.newValue;
    }

    if (changes.enabled != undefined) {
      enabled = changes.enabled.newValue;
    }
  });
};

// listen to request and redirect when requesting wrong version of docs
var addRequestListener = function () {
  chrome.webRequest.onBeforeRequest.addListener(function (details) {
    if (enabled) {
      var newUrl = details.url.replace(docVersionRegex, "$1" + requiredVersion + "$3");
      if (newUrl != details.url) {
        return { redirectUrl: newUrl }
      }  
    }
  }, { urls: ["*://symfony.com/*"] },
     ["blocking"]
  );
};

var init = function () {
  initializeEnabled();
  initializeVersion(); 
  addOptionsChangeListener();
  addRequestListener();
}

init();
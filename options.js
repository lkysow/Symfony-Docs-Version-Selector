var saveVersion = function () {
  var versionSelect = getVersionSelect();
  var version = versionSelect.children[versionSelect.selectedIndex].value;
  save({"version": version});
}

var saveEnabled = function() {
  save({"enabled": getEnabledCheckbox().checked});
}

var getEnabledCheckbox = function() {
  return document.getElementById("enabled");
}

var restoreOptions = function () {
  chrome.storage.sync.get(["enabled", "version"], function (items) {
    if (items.enabled != undefined) {
      updateEnabledCheckbox(items.enabled);
    }

    if (items.version) {
      updateVersionSelect(items.version);
    }
  });
}

var updateVersionSelect = function(version) {
  var select = getVersionSelect();
  for (var i = 0; i < select.children.length; i++) {
    var child = select.children[i];
    if (child.value == version) {
      child.selected = "true";
      break;
    }
  }
};

var updateEnabledCheckbox = function(enabled) {
  getEnabledCheckbox().checked = enabled;
}

var getVersionSelect = function () {
  return document.getElementById("version");
}

var save = function (obj) {
  chrome.storage.sync.set(obj, function () {});
}

var main = function () {
  restoreOptions();
  getVersionSelect().addEventListener('change', saveVersion);
  getEnabledCheckbox().addEventListener('change', saveEnabled);
}

// debug
var log = function (obj) {
  chrome.extension.getBackgroundPage().console.log(obj);
}

document.addEventListener('DOMContentLoaded', main);
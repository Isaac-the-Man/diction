'use strict';

let control = document.getElementById('diction-enabled');
chrome.storage.sync.get('isEnabled', function (data) {
    control.checked = data.isEnabled;
});
control.onchange = function() {
    chrome.storage.sync.set({
        isEnabled: control.checked
    }, () => {
        console.log(`diction ${control.checked ? 'enabled' : 'disabled'}`);
    })
}

let anchor = document.getElementById('diction-anchor');
chrome.storage.sync.get('anchor', function (data) {
    anchor.value = data.anchor;
});
anchor.onchange = function() {
    chrome.storage.sync.set({
        anchor: anchor.value
    }, () => {
        console.log(`diction anchored at ${anchor.value}`);
    })
}

'use strict';

let control = document.getElementById('diction-enabled');
chrome.storage.sync.get('isEnabled', function (data) {
    control.checked = data.isEnabled;
    // set initial badge status
    chrome.action.setBadgeBackgroundColor({ color: control.checked ? '#2196F3' : '#F44336' })
    chrome.action.setBadgeText({
        text: control.checked ? 'ON' : 'OFF'
    }, () => {})
});
control.onchange = function() {
    chrome.storage.sync.set({
        isEnabled: control.checked
    }, () => {
        console.log(`diction ${control.checked ? 'enabled' : 'disabled'}`);
    })
    // update on/off badge status
    console.log(chrome.action)
    console.log(chrome.browser_action)
    chrome.action.setBadgeBackgroundColor({ color: control.checked ? '#2196F3' : '#F44336' })
    chrome.action.setBadgeText({
        text: control.checked ? 'ON' : 'OFF'
    }, () => {})
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

'use strict';

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        isEnabled: true,
        anchor: 'br'
    }, function () {
        console.log("Diction Initialized.");
    });
});
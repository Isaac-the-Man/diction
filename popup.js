// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let control = document.getElementById('dictionEnabled');
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

let anchor = document.getElementById('dictionAnchor');
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

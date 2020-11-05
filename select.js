function getSelectionText() {
    let text = "";
    let activeEl = document.activeElement;
    let activeElTagName = activeEl ? activeEl.tagName.toLowerCase() : null;
    if (
        (activeElTagName == "textarea") || (activeElTagName == "input" &&
        /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
        (typeof activeEl.selectionStart == "number")
    ) {
        text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
    } else if (window.getSelection()) {
        text = window.getSelection().toString();
    }
    return text;
}

async function fetchWord(word) {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (res.status === 200) {    // definition found
        const data = await res.json();
        console.log(data);
        return data;
    } else {
        console.log('no definition found');
        return null;
    }
}

async function pushDict(word) {
    let data;
    let isError = false;
    try {
        data = await fetchWord(word); // fetch definition from google
    } catch (e) {
        console.log('could not fetch dictionary...');
        isError = true;
    }
    let parent = document.createElement('div');
    parent.classList.add('reset-parent');
    let div = document.createElement('div');
    if (data) { // definition found
        // dictionary title
        let title = document.createElement('h4');
        title.innerText = word;
        div.appendChild(title);
        let hr = document.createElement('hr');
        div.appendChild(hr);
        // parse data to display
        const meanings = data[0].meanings;    // take top source
        for (let meaning of meanings) { // show all types
            let type = document.createElement('div');
            type.classList.add('type')
            type.innerText = meaning.partOfSpeech;
            div.appendChild(type);
            let defs = document.createElement('ol');
            for (let i = 0; i < 2; ++i) {   // show first two definition
                if (i < meaning.definitions.length) {
                    let item = meaning.definitions[i];
                    let def = document.createElement('li');
                    let defText = document.createElement('small');
                    defText.innerText = item.definition;
                    def.appendChild(defText);
                    if (item.example) { // insert example if exists
                        let br = document.createElement('br');
                        def.appendChild(br);
                        let defEx = document.createElement('small');
                        defEx.classList.add('ex');
                        defEx.innerText = `"${item.example}"`;
                        def.appendChild(defEx);
                    }
                    defs.appendChild(def);
                }
            }
            div.appendChild(defs);
        }
    } else if (!isError) {    // definition not found
        let warning = document.createTextNode(`Unknown word "${word}".`);
        div.appendChild(warning);
    } else {    // api error
        let warning = document.createTextNode(`Could not fetch dictionary.`);
        div.appendChild(warning);
    }
    // append to body
    div.classList.add('dictionNotification', 'fade-in');
    parent.appendChild(div);
    hideOnClickOutside(div);
    return parent;
}

function wordCount(word) {
    const words = word.split(' ');
    return words.length;
}

function hideOnClickOutside(element) {
    const outSideClickListener = (event) => {
        if (element && !element.contains(event.target)) {
            console.log(element.classList);
            element.classList.replace('fade-in', 'fade-out');
            setTimeout(function () {
                element.remove();
                removeClickListener();
            }, 400);
        }
    }
    const removeClickListener = () => {
        document.removeEventListener('click', outSideClickListener);
    }
    document.addEventListener('click', outSideClickListener);
}


let selected = '';
let prevTimer;
let anchor = 'tr';
let prevDict;
const select = function () {
    selected = getSelectionText().trim();
    if (prevTimer) {   // clear prev timer
        clearTimeout(prevTimer);
    }
    if (selected !== '' && wordCount(selected) <= 2) {  // only fire when string is not empty, and has word count less then 2
        prevTimer = setTimeout(async function () {
            console.log(selected);
            prevDict = await pushDict(selected);
            prevDict.classList.add(anchor);
            document.body.appendChild(prevDict);
        }, 1500);
    }
};
chrome.storage.sync.get('isEnabled', function (data) {
    if (data.isEnabled) {
        document.onselectionchange = select;
    }
});
chrome.storage.sync.get('anchor', function (data) {
    anchor = data.anchor;
});
chrome.storage.onChanged.addListener(function (changes) {
    console.log(changes);
    if (changes.isEnabled) {
        if (changes.isEnabled.newValue) {    // enable diction
            console.log('enabled');
            document.onselectionchange = select;
        } else {    // diction disabled
            console.log('disabled');
            document.onselectionchange = null;
        }
    }
    if (changes.anchor) {
        anchor = changes.anchor.newValue;
        if (prevDict) {
            prevDict.classList.replace(changes.anchor.oldValue, changes.anchor.newValue);
        }
    }
});


console.log("content script injected !");
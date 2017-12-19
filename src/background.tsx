chrome .browserAction.onClicked.addListener((activeTab) => {
    const newURL = chrome.extension.getURL('index.html')
    chrome.tabs.create({ url: newURL })
})
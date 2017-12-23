import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

chrome.browserAction.onClicked.addListener((activeTab) => {
    const newURL = chrome.extension.getURL('index.html')
    chrome.tabs.create({ url: newURL })
})

if (typeof chrome.runtime.onMessage.addListener === 'function') {
  chrome.runtime.onMessage.addListener(
    (message: {action: string, payload?: any}, sender: any, sendResponse: (response: any) => void) => {
      if (message.action === 'request') {
        console.debug('message received:', message.payload)
        axios.request(message.payload).then((response: AxiosResponse) => sendResponse(response))
      }
      return true
    })
}

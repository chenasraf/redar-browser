import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

chrome.browserAction.onClicked.addListener((activeTab) => {
    const newURL = chrome.extension.getURL('index.html')
    chrome.tabs.create({ url: newURL })
})

interface Action {
  action: string
  payload?: any
}

type Responder = (response: any) => void

if (typeof chrome.runtime.onMessage.addListener === 'function') {
  chrome.runtime.onMessage.addListener(
    (message: Action, sender: any, sendResponse: Responder) => {
      if (message.action === 'request') {
        axios.request(message.payload)
          .then((response: AxiosResponse) => sendResponse(response))
          .catch((error: AxiosError) => {
            console.error(error)
            console.log({ respone: error.response, request: error.request })
            sendResponse(error)
          })
      }
      return true
    })
}

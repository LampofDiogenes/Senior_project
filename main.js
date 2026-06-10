const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const { session } = require('electron')

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration : false,
      contextIsolation : true,
      sandbox : false
    }
  })
  win.loadFile('UI/index.html')
}

// app.whenReady().then(() => {
//   createWindow()
// })

secure_startup()


async function secure_startup()
{
  await app.whenReady().then(() => {
    createWindow()
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      'Content-Security-Policy': [
          '*'
      ]
    }
  })
})
}



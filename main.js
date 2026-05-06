const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')

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
app.whenReady().then(() => {
    console.log("the current directory is: ", __dirname)
  createWindow()
})
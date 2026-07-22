const { app, BrowserWindow, ipcMain } = require('electron/main')
const path = require('node:path')
const { session } = require('electron')
const  fs  = require('node:fs')


// this function is failing I think
function getScrapesRoot() {
  
  const scrapesRoot = app.isPackaged
    ? path.join(app.getPath('userData'), 'web_gnome/scrapes')
    : path.join(__dirname, 'UI', 'scrapes')
  
    // mkdir if missing...
  if (!fs.existsSync(scrapesRoot)) {
    fs.mkdirSync(scrapesRoot, { recursive: true })
  }

  return scrapesRoot
}

const createWindow = () => {
  if (require('electron-squirrel-startup')) app.quit();
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'gnome.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration : false,
      contextIsolation : true,
      sandbox : false
    }
  })
  win.loadFile('UI/index.html')
}

async function secure_startup()
{
  await app.whenReady().then(() => {
    createWindow()
  })

  // session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
  // callback({
  //   responseHeaders: {
  //     ...details.responseHeaders,
  //     'Content-Security-Policy': [
  //         '*'
  //     ]
  //   }
  // })
  // })
}

ipcMain.handle('get-scrapes-root', () => getScrapesRoot())
secure_startup()
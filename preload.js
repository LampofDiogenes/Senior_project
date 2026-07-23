const { contextBridge, ipcRenderer } = require('electron');
const fs  = require('fs');
const path = require('node:path');

function removeFile(filePath) {
  try {
    fs.accessSync(filePath); // Check if file exists before deleting
    fs.unlinkSync(filePath); // Delete the file
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('File does not exist');
    } else {
      console.error('Error deleting file:', err);
    }
  }
}

try {
  contextBridge.exposeInMainWorld(
    'nodeFunctions', 
    {
        // found in fetch_html_code
        dirname : __dirname,
        createFile: (path, content, format) => fs.writeFileSync(path, content, format),
        existsSync : (p) => fs.existsSync(p),
        mkdirSync : (p) => fs.mkdirSync(p, {recursive : true}),

        // found in saved_scrapes.js
        readdir : (dir) => fs.readdir(dir, (err, files)),
        readdirSync : (dir) => fs.readdirSync(dir),

        // AI suggested functions to make it work while packaged
        getScrapesRoot: () => ipcRenderer.invoke('get-scrapes-root'),
        joinPath: (...parts) => path.join(...parts),

        // might be important later
        deleteFile : (filePath) => removeFile(filePath),
        readFile: (p) => fs.readFileSync(p, 'utf-8'),
        statSync: (p) => fs.statSync(p),
        isDirectory: (p) => fs.statSync(p).isDirectory(),
        fileSize: (p) => fs.statSync(p).size,
        sendmail : (from, to, subject, text) => send_mail(from, to, subject, text)

    }
)}
catch
{console.log('issue in preloader')}

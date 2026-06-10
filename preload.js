const { contextBridge } = require('electron');
const fs  = require('fs');
const nodemailer = require('nodemailer');

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
        createFile: (path, content, format) => fs.writeFileSync(path, content, format),
        existsSync : (p) => fs.existsSync(p),
        mkdirSync : (p) => fs.mkdirSync(p),

        // found in saved_scrapes.js
        readdir : (dir) => fs.readdir(dir, (err, files)),
        readdirSync : (dir) => fs.readdirSync(dir),

        // might be important later
        deleteFile : (filePath) => removeFile(filePath),
        readFile: (p) => fs.readFileSync(p, 'utf-8')

    },
  'nodemailer',
    {
      createTransport : (args) => nodemailer.createTransport(args),
      send : (transport, from, to, subject, text) => transport.sendMail(
      {
        from: from,
        to: to,
        subject: subject,
        text: text,
      })
    }
)}
catch
{console.log('issue in preloader')}

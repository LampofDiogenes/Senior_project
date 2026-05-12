const { contextBridge } = require('electron');
const fs  = require('fs');

console.log("preloader started")

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
        // readFile: (p) => fs.readFileSync(p, 'utf-8'),
        // createFile: (path, content, format) => fs.writeFileSync(path, content, format),
        // deleteFile : (filePath) => removeFile(filePath)

        readFile: (p) => fs.readFileSync(p, 'utf-8'),
        createFile: (path, content, format) => fs.writeFileSync(path, content, format),
        deleteFile : (filePath) => removeFile(filePath)
    });
} catch (err) {
  console.error('Context Bridge error:', err);
}
console.log("preload loaded")
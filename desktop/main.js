const { app, BrowserWindow, ipcMain, shell, Menu, protocol, webFrame } = require('electron');
const url = require('url');
const path = require('path');
const isDev = require('electron-is-dev');
const log = require('electron-log');
log.transports.file.level = 'info';

global.resourcesPath = process.resourcesPath;

app.setAsDefaultProtocolClient('qlc'); // Register handler for xrb: links

let mainWindow;

platform = process.platform;

if (isDev) {
  console.log('Running in development');
} else {
  console.log('Running in production');
}


function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 1300,
    height: 900,
    webPreferences: { webSecurity: true, nodeIntegration: true },
    icon: path.join(__dirname, '../dist/assets/favicon/favicon.ico')
  });
  // const options = { extraHeaders: "pragma: no-cache\n" };
  
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, '../dist/index.html'),
      protocol: 'file:',
      slashes: true
    })
  );
    
  // Open dev tools
  if (isDev) mainWindow.webContents.openDevTools();
    
  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  
  mainWindow.webContents.on('new-window', function(e, url) {
    e.preventDefault();
    shell.openExternal(url);
  });
    
  const menuTemplate = getApplicationMenu();
  
  // Create our menu entries so that we can use MAC shortcuts
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
}
  
  
app.on('ready', () => {
  // Once the app is ready, launch the wallet window
  createWindow();
  // Detect when the application has been loaded using an xrb: link, send it to the wallet to load
  app.on('open-url', (event, path) => {
    if (!mainWindow) {
      createWindow();
    }
    if (!mainWindow.webContents.isLoading()) {
      mainWindow.webContents.executeJavaScript(
        `window.dispatchEvent(new CustomEvent('protocol-load', { detail: '${path}' }));`
      );
    }
    mainWindow.webContents.once('did-finish-load', () => {
      mainWindow.webContents.executeJavaScript(
        `window.dispatchEvent(new CustomEvent('protocol-load', { detail: '${path}' }));`
        );
    });
    event.preventDefault();
  });
      
  // Check for any updates on GitHub
  //mainWindow.webContents.send('update-check','');
});
      
// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
      
app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
      
// Build up the menu bar options based on platform
function getApplicationMenu() {
  const template = [
    {
      label: 'View',
      submenu: [
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      role: 'window',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    },
    {
      role: 'help',
      submenu: [
      ]
    }
  ];
  
  if (process.platform === 'darwin') {
    template.unshift({
      label: 'Confidant',
      submenu: [
      ]
    });
    
  }
  
  return template;
}
      
function loadExternal(url) {
  shell.openExternal(url);
}
      
      
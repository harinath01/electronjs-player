const { app, BrowserWindow, Menu, dialog } = require('electron');
const os = require('os');
const path = require('path');
const getMACModule = require('getmac');
const getMAC =
  typeof getMACModule === 'function' ? getMACModule : getMACModule.default;
const { machineIdSync } = require('node-machine-id');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: false
    },
  });

  function getAllMACs() {
    const nets = os.networkInterfaces();
    const macs = [];

    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Check if the MAC address is valid, not internal, and not already included
        if (net.mac && net.mac !== '00:00:00:00:00:00' && !net.internal && !macs.includes(net.mac)) {
          macs.push(net.mac);
        }
      }
    }

    return macs.join('|');
  }

  // Send machine information to the web page
  const machineInfo = {
    machineName: os.hostname(),
    macAddress: getMAC(),
    machineId: machineIdSync(true),
    allMacs: getAllMACs(),
    os: os.platform(),
  };

  // and load the index.html of the app.
  mainWindow.loadURL('https://app.theuniqueacademycommerce.com/dashboard');
  // mainWindow.loadURL('http://localhost:4050/dashboard');

  mainWindow.webContents.on('context-menu', (event, params) => {
    event.preventDefault(); // Prevent the default context menu
  });

  mainWindow.webContents.on('dom-ready', () => {
    const script = `
      localStorage.setItem('machineName', '${machineInfo.machineName}');
      localStorage.setItem('macAddress', '${machineInfo.macAddress}');
      localStorage.setItem('machineId', '${machineInfo.machineId}');
      localStorage.setItem('allMacs', '${machineInfo.allMacs}');
      localStorage.setItem('os', '${machineInfo.os}');
      localStorage.setItem('flag', 'win');
      localStorage.setItem('appVersion', '8081');
    `;

    // Execute the script in the renderer process
    mainWindow.webContents.executeJavaScript(script);
  });

  mainWindow.maximize();
  mainWindow.setContentProtection(true);
  console.log("Machine Info: ", machineInfo);

  const menuTemplate = [
    {
      label: app.getName(),
      submenu: [
        {
          label: 'About ' + app.getName(),
          click: () => {
            showAboutDialog();
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit' + app.getName(),
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'File',
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  function showAboutDialog() {
    const aboutOptions = {
      title: 'About ' + app.getName(),
      version: app.getVersion(),
      copyright: 'Copyright © Dtree Labs LLP',
      icon: 'icon.png',
      text: 'https://dtreelabs.com',
    };
    dialog.showMessageBox(mainWindow, aboutOptions);
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
app.setName('Unique Academy App');
app.commandLine.appendSwitch('disable-features', 'IOSurfaceCapturer,DesktopCaptureMacV2')

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
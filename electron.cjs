const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 1024,
        minHeight: 768,
        title: "Velankanni Biller - Desktop Edition",
        icon: path.join(__dirname, 'public/favicon.ico'), // Fallback if icon exists
        webPreferences: {
            nodeIntegration: false, // Security Best Practice
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.cjs'),
        },
    });

    // Load the app
    const startUrl = isDev
        ? 'http://localhost:5173'
        : `file://${path.join(__dirname, 'dist/index.html')}`;

    win.loadURL(startUrl);

    // Open DevTools in development
    if (isDev) {
        win.webContents.openDevTools();
    }

    // Remove default menu for premium feel
    win.removeMenu();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

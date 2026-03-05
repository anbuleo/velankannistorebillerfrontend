const { contextBridge, ipcRenderer } = require('electron');

// Expose protected APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // We can add desktop-specific features here later (like direct thermal printing)
});

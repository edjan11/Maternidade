
            const { contextBridge, ipcRenderer } = require('electron');
            contextBridge.exposeInMainWorld('api', {
                saveCredentials: (data) => ipcRenderer.send('save-credentials', data)
            });
        
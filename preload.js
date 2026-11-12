const { contextBridge, ipcRenderer } = require("electron");

// Expose safe functions to the frontend
contextBridge.exposeInMainWorld("optionPicker", {
    getAppVersion: () => ipcRenderer.invoke("get-app-version")
});

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

// Create the application window
function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 750,
        minWidth: 750,
        minHeight: 600,

        title: "Option Picker",

        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Load the HTML file
    win.loadFile("index.html");
}

// Return the application version
ipcMain.handle("get-app-version", () => {
    return app.getVersion();
});

// Start the application
app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Close application on Windows and Linux
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

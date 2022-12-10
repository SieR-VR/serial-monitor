import { app, BrowserWindow } from "electron";
import { registerSerialCallback } from "./serial";

let mainWindow: Electron.BrowserWindow | null;

function createWindow() {
    mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: __dirname + "/preload.js"
        }
    });

    mainWindow.loadURL(`file://${__dirname}/frontend/index.html`);

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    registerSerialCallback(mainWindow);
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
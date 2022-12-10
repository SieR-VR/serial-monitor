import { BrowserWindow, ipcMain } from "electron";
import { SerialPort } from "serialport";

let serialMap = new Map<string, SerialPort>();

export async function registerSerialCallback(window: BrowserWindow) {
    ipcMain.on("serial/list", (event, arg) => {
        console.log("serial/list");

        SerialPort.list().then((ports) => {
            ipcMain.emit("serial/list", ports);
        });
    });

    ipcMain.on("serial/open", (event, arg: { path: string, baudRate: number }) => {
        const port = new SerialPort(arg, (err) => {
            if (err) {
                ipcMain.emit("serial/open", err);
            }
        });
        serialMap.set(arg.path, port);
    });

    ipcMain.on("serial/close", (event, arg: { path: string }) => {
        const port = serialMap.get(arg.path);
        if (port) {
            port.close();
            serialMap.delete(arg.path);
        }
    });

    ipcMain.on("serial/write", (event, arg: { path: string, data: string }) => {
        const port = serialMap.get(arg.path);
        if (port) {
            port.write(arg.data);
        }
    });
}
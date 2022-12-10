import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { PortInfo } from "@serialport/bindings-cpp";

const ipc = {
    serial: {
        list: () => ipcRenderer.emit("serial/list"),
        open: (path: string, baudRate: number) => ipcRenderer.invoke("serial/open", { path, baudRate }),
        close: (path: string) => ipcRenderer.invoke("serial/close", { path }),
        write: (path: string, data: string) => ipcRenderer.invoke("serial/write", { path, data }),
    },
    serialEvents: {
        onList: (callback: (event: IpcRendererEvent, ports: PortInfo[]) => void) => ipcRenderer.on("serial/list", callback),
        onOpen: (callback: (err: any) => void) => ipcRenderer.on("serial/open", callback),
        onClose: (callback: (err: any) => void) => ipcRenderer.on("serial/close", callback),
    },
    onload: () => {
        function onSendBtnClick() {
            const inputElement = document.getElementById('input') as HTMLInputElement;
            const value = inputElement.value;

            // Send the value to the backend
        }

        function onListBtnClick() {
            // Request the list of values from the backend
            ipcRenderer.on("serial/list", (event, ports) => {
                console.log(ports);
            })

            ipcRenderer.emit("serial/list");
        }

        const sendBtn = document.getElementById('send') as HTMLButtonElement;
        sendBtn.addEventListener('click', onSendBtnClick);

        const listBtn = document.getElementById('list') as HTMLButtonElement;
        listBtn.addEventListener('click', onListBtnClick);
    }
} as const;

contextBridge.exposeInMainWorld("ipc", ipc);

export type Ipc = typeof ipc;
export default {};


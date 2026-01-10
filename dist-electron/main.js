"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const isDev = !electron_1.app.isPackaged;
let mainWindow = null;
let serverProc = null;
function createMainWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        backgroundColor: '#000000',
        autoHideMenuBar: true,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        }
    });
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
    else {
        mainWindow.loadURL('http://localhost:3000');
    }
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron_1.shell.openExternal(url);
        return { action: 'deny' };
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
function startNextServer() {
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    serverProc = (0, child_process_1.spawn)(cmd, ['run', 'start'], {
        cwd: path_1.default.join(__dirname, '..'),
        env: { ...process.env, PORT: '3000' }
    });
}
electron_1.app.on('ready', () => {
    if (!isDev)
        startNextServer();
    createMainWindow();
});
electron_1.app.on('quit', () => serverProc?.kill());

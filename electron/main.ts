import { app, BrowserWindow, shell } from 'electron'
import path from 'path'
import { spawn } from 'child_process'

const isDev = !app.isPackaged
let mainWindow: BrowserWindow | null = null
let serverProc: ReturnType<typeof spawn> | null = null

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    mainWindow.loadURL('http://localhost:3000')
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function startNextServer() {
  const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  serverProc = spawn(cmd, ['run', 'start'], {
    cwd: path.join(__dirname, '..'),
    env: { ...process.env, PORT: '3000' }
  })
}

app.on('ready', () => {
  if (!isDev) startNextServer()
  createMainWindow()
})
app.on('quit', () => serverProc?.kill())

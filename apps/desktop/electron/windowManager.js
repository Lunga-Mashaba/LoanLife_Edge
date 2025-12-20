import { BrowserWindow } from 'electron';

export const createMainWindow = () =>
  new BrowserWindow({
    width: 1200,
    height: 800,
    backgroundColor: '#0b1b2b',
    webPreferences: { contextIsolation: true, preload: 'preload.js' }
  });

import { contextBridge } from 'electron';

// expose safe, limited APIs (expand later for file ops or settings)
contextBridge.exposeInMainWorld('loanlife', {
  version: '1.0.0'
});

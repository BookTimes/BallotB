const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => ipcRenderer.on(channel, callback),
  saveCandid: (candidatelist) =>
    ipcRenderer.invoke("candidate-data", candidatelist),
  primarySave: (hostdata) => ipcRenderer.invoke("host-data", hostdata),
  getIpEncode: () => ipcRenderer.invoke("ip-encode"),
  replyBooth: (auth, resp) => ipcRenderer.invoke("booth-reply", [auth, resp]),
  sushand: (callback) => ipcRenderer.on("handshake-detect", callback),
  voteUpdt: (callback) => ipcRenderer.on("ballot-detect", callback),
  saveBoothData: (boothname) => ipcRenderer.invoke("save-booth", boothname),
  HostCode: (hostcode) => ipcRenderer.invoke("save-host", hostcode),
  connected: (callback) => ipcRenderer.on("connection-succ", callback),
  startServer: () => ipcRenderer.invoke("start-host"),
  startElect: () => ipcRenderer.invoke("start-election"),
  winoo: (callback) => ipcRenderer.on("election-window", callback),
  retriveCandidates: () => ipcRenderer.invoke("get-candidates"),
  ballot: (code) => ipcRenderer.invoke("ballot-out", code),
  liveEval: () => ipcRenderer.invoke("live-eval"),
  enz: () => ipcRenderer.invoke("ballot-enz"),
  clientListing: () => ipcRenderer.invoke("client-listing"),
  revokeClient: (auth) => ipcRenderer.invoke("revoke", auth),
});

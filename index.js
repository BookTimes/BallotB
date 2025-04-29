const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const os = require("os");
const ipcon = require("ip-to-int");
let candidates;
let host;
const path = require("path");
const { notDeepEqual } = require("assert");
const { json } = require("body-parser");
const { log } = require("console");
const clients = new Map();
let boothName;
let metaList = [];
var lockerauth = 0;
const boothcd = new Map();
const authCode = new Map();
const lockerCode = new Map();
let currentWindow;
var isl = false;
var lcr = [];

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (let interfaceName in interfaces) {
    for (let iface of interfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return null;
}

function lowEval() {
  const lockerObj = {};
  for (const lock of metaList) {
    lockerObj[lock] = lockerObj[lock] ? lockerObj[lock] + 1 : 1;
  }
  const result = {};

  Object.keys(lockerObj).forEach((code) => {
    console.log();
    result[lockerCode.get(Number(code))] = lockerObj[code];
  });

  return result;
}

async function lockProcess(code, ip) {
  lockerauth++;
  // boothcd.get(ipcon(ip).toInt()).push(code);
  ip.lockerCount.push(code);
  metaList.push(code);
  currentWindow.webContents.send("ballot-detect", lockerauth);
}

const socket = require("ws");
let server;

ipcMain.handle("start-host", async (event) => {
  try {
    server = new socket.Server({ port: 3000 });
  } catch {
    app.quit();
  }
  server.on("connection", (ws, req) => {
    ws.send(JSON.stringify({ prt: "041" }));
    ws.on("message", (data) => {
      proto = JSON.parse(data).prt;
      auth = JSON.parse(data).auth;
      if (proto == "042") {
        showNotification("New Connection", auth);
        currentWindow.webContents.send("handshake-detect", auth);
        ws.lockerCount = [];
        clients.set(auth, ws);
        lcr.push(auth);
        console.log(clients);
      } else if (proto == "444") {
        code = JSON.parse(data).code;
        lockProcess(code, ws);
      }
    });
  });
});

ipcMain.handle("candidate-data", async (event, candidatelist) => {
  candidates = candidatelist;
});

ipcMain.handle("host-data", async (event, hostdata) => {
  host = hostdata;
});

ipcMain.handle("get-candidates", async (event) => {
  return JSON.stringify(candidates);
});

ipcMain.handle("ballot-out", async (event, candid) => {
  code = authCode[candid];
  console.log("code", code);
  server.send(JSON.stringify({ prt: 444, code: code }));
});

ipcMain.handle("booth-reply", async (event, boothData) => {
  const wss = clients.get(boothData[0]);
  let data;
  if (boothData[1] == "confirm") {
    data = JSON.stringify({
      prt: 200,
      hostname: host,
      candidates: candidates,
    });
    if (isl) {
      let authCodes = [];
      candidates.forEach((r) => {
        const lockerrest = Math.floor(Math.random() * 10000);
        authCodes.push(lockerrest);
        lockerCode.set(lockerrest, r);
      });
      clients.forEach((client) => {
        client.send(JSON.stringify({ prt: 2020, authcode: authCodes }));
      });
    }
  } else {
    clients.delete(boothData[0]);
    data = JSON.stringify({ prt: 303 });
  }
  wss.send(data);
});

ipcMain.handle("save-booth", async (event, boothname) => {
  boothName = boothname;
});

ipcMain.handle("start-election", async (event, boothname) => {
  let authCodes = [];
  candidates.forEach((r) => {
    const lockerrest = Math.floor(Math.random() * 10000);
    authCodes.push(lockerrest);
    lockerCode.set(lockerrest, r);
    console.log(lockerCode);
    lcr = true;
  });
  clients.forEach((client) => {
    client.send(JSON.stringify({ prt: 2020, authcode: authCodes }));
  });
  isl = true;
});

ipcMain.handle("save-host", async (event, hostcode) => {
  //forClientSide
  const ws = new socket.WebSocket(`ws://${ipcon(hostcode).toIP()}:3000`);
  server = ws;
  ws.on("message", (data) => {
    protcol = JSON.parse(data).prt;
    if (protcol == "041") {
      ws.send(JSON.stringify({ prt: "042", ip: "111", auth: boothName }));
    } else if (protcol == "200" || protcol == "303") {
      currentWindow.webContents.send("connection-succ", protcol);
      candidates = JSON.parse(data).candidates;
      host = JSON.parse(data).hostname;
    } else if (protcol == "2020") {
      authent = JSON.parse(data).authcode;
      candidates.forEach((candidate, i) => {
        authCode[candidate] = authent[i];
        lockerCode.set(authent[i], candidate);
      });
      currentWindow.webContents.send("election-window");
    } else if (protcol == "211") {
      currentWindow = createWindow("booth/election-eval");
      const relEval = lowEval();
      msg = { prt: 916, rsv: relEval };
      ws.send(JSON.stringify(msg));
    }
  });
});

ipcMain.handle("ip-encode", async (event) => {
  return ipcon(getLocalIpAddress()).toInt();
});

ipcMain.handle("ballot-enz", async (event) => {
  currentWindow = createWindow("host/election-result");
  clients.forEach((client) => {
    msg = { prt: 211 };
    client.send(JSON.stringify(msg));
  });
});

function createWindow(screenName) {
  const window = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  const filePath = path.join(__dirname, screenName, "index.html");
  window.loadFile(filePath);

  return window;
}

function showNotification(t, b) {
  new Notification({ title: t, body: b }).show();
}

ipcMain.handle("live-eval", async (event) => {
  return JSON.stringify(lowEval());
});

ipcMain.handle("client-listing", async (event) => {
  const ckeys = JSON.stringify(lcr);
  console.log(ckeys);
  return ckeys;
});

ipcMain.handle("revoke", async (event, auth) => {
  clients.delete(auth);
  ind = lcr.indexOf(auth);
  lcr.splice(ind, 1);
});

app.whenReady().then(() => {
  currentWindow = createWindow("welcome-window"); // Start with main screen

  ipcMain.on("open-screen", (event, screenName) => {
    if (currentWindow) {
      currentWindow.close();
    }
    currentWindow = createWindow(screenName); // Open the requested screen
  });

  app.on("window-all-closed", () => {
    app.quit();
  });
});

document.getElementById("host").addEventListener("click", async () => {
  const l = await window.electron.startServer();
  window.electron.send("open-screen", "host/host_primary");
});

document.querySelector("#booth").addEventListener("click", () => {
  window.electron.send("open-screen", "booth/booth_primary");
});

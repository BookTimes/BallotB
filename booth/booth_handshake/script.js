const saveBoothData = function (l) {
  window.electron.HostCode(document.querySelector(".setup-field").value);
  document
    .querySelectorAll(".loader")
    .forEach((r) => (r.style.visibility = "visible"));
  document.querySelector(".host-setup").style.visibility = "hidden";
};

window.electron.connected((e, resp) => {
  if (resp == "200") {
    document.querySelector(".loader").style.animation = "connect 2s";
    document.querySelector(".loader").style.width = "0vw";
    document.querySelector(".connect-title").innerText = "Connected";
    document
      .querySelector(".connect-title")
      .classList.add("connect-title-connected");
    setTimeout(() => {
      const cont = document.querySelector(".connect-cont");
      cont.style.transition = "2s";
      cont.style.width = "30vw";
      cont.style.borderRadius = "10%";
      document.querySelector(".connect-title").innerHTML =
        "<b>Waiting for host to start the election</b> <br> Make sure the booth is in range of the local network <br>Plugging in the booth system would be preferable";
    }, 3000);
  } else if (resp == "303") {
    document.querySelector(".loader").style.animation = "connect 2s";
    document.querySelector(".loader").style.width = "0vw";
    document.querySelector(".connect-title").innerText = "Denied";
    document
      .querySelector(".connect-title")
      .classList.add("connect-title-disconnected");
  }
});
window.electron.winoo(() => {
  window.electron.send("open-screen", "booth/election");
});

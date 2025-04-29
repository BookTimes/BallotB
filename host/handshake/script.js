const loadEnc = async function () {
  const encodedIP = await window.electron.getIpEncode();
  document.getElementById("ipp").innerHTML = encodedIP;
};
loadEnc();
clienting();
window.electron.sushand((event, data) => {
  html = ` <div class="booth-request" >
        <div class="booth-sect">
          <span class="booth-title"> ${data} </span>
          <span class="booth-subtitle">Booth wants to connect</span>
        </div>
        <div class="booth-sect" auth=${data}>
          <button class="booth-btn" onclick='replyBooth(this , "confirm")' type="button">Connect</button>
          <button class="booth-btn" onclick='replyBooth(this , "deny")' >Deny</button>
        </div>
      </div>`;
  document
    .querySelector(".booth-request-cont")
    .insertAdjacentHTML("beforeend", html);
  if (document.getElementById("wait")) {
    document.getElementById("wait").remove();
  } else {
  }
});
const replyBooth = function (btn, resp) {
  const auth = btn.parentElement.getAttribute("auth");
  window.electron.replyBooth(auth, resp);
  btn.parentElement.parentElement.remove();

  if (resp == "confirm") {
    // const k = document.getElementById("boothNo").innerText;
    // document.getElementById("boothNo").innerText = Number(k) + 1;
    clienting();
  }
};

function disconnectBooth(btn) {
  const auth = btn.parentElement.getAttribute("auth");
  window.electron.revokeClient(auth);
  btn.parentElement.parentElement.remove();
  console.log("disconnecting", auth);
  clienting();
}

function startE() {
  window.electron.startElect();
  window.electron.send("open-screen", "host/election");
}

async function clienting() {
  const clientListenc = await window.electron.clientListing();
  clientList = JSON.parse(clientListenc);
  document.getElementById("boothNo").innerText = clientList.length;
  document.querySelector(".client-list").innerHTML = "";
  for (client of clientList) {
    html = ` <div class="booth-request client-request">
              <div class="booth-sect">
                <span class="booth-title client-title"> ${client} </span>
              </div>
              <div class="booth-sect" auth="${client}">
                <button
                  class="booth-btn client-btn"
                  onclick='disconnectBooth(this)'
                  type="button"
                >
                  Disconnect
                </button>
              </div>
            </div>`;
    document
      .querySelector(".client-list")
      .insertAdjacentHTML("beforeend", html);
  }
}

document.querySelector(".wlc-head").addEventListener("click");
function miz() {
  navigator.clipboard.writeText(document.querySelector("#ipp").innerText);
  document.querySelector(".message").style.opacity = 1;
  setTimeout(function () {
    document.querySelector(".message").style.opacity = 0;
  }, 2000);
}

document.querySelector(".refresh-img").addEventListener("click", function () {
  clienting();
  alert("i");
});

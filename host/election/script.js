document.querySelector(".show-btn").addEventListener("click", () => {
  document.querySelector(".overlay").style.transition = "2s";
  document.querySelector(".overlay").style.opacity = 0;
  document.querySelector(".show-btn").style.opacity = 0;
  setTimeout(() => {
    document.querySelector(".overlay").style.opacity = 1;
    document.querySelector(".show-btn").style.opacity = 1;
  }, 4000);
  document.querySelectorAll(".candid").forEach((can) => {
    can.remove();
  });
});

window.electron.voteUpdt((event, data) => {
  document.querySelector(".ballot-counter").innerHTML = data;
});
let kop;
document
  .querySelector(".show-btn")
  .addEventListener("click", async function () {
    const liveList = await window.electron.liveEval();
    kop = JSON.parse(liveList);
    for ([can, bal] of Object.entries(kop)) {
      html = `<div class="candid">
              <span class="rank">${bal}</span>
              <span class="candid-title">${can}</span>
            </div>`;
      document.querySelector(".candids").insertAdjacentHTML("afterbegin", html);
    }
  });

document.querySelectorAll(".ballot-choice").forEach((choice) => {
  let holdout;
  let btn;
  choice.addEventListener("mousedown", function (e) {
    btn = e.target;
    holdout = setTimeout(() => {
      const ov = document.querySelector(".overlay");
      ov.style.zIndex = 1;
      ov.style.opacity = 1;
      setTimeout(() => {
        ov.style.zIndex = -1;
        ov.style.opacity = 0;
      }, 4000);
      window.electron.enz();
    }, 2000);
  });
  choice.addEventListener("mouseup", function (e) {
    btn = e.target;
    clearTimeout(holdout);
  });
});

document.querySelector(".end").addEventListener("click", function () {
  window.electron.send("open-screen", "host/election-result");
});

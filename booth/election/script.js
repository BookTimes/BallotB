let h = 0;

document.addEventListener("DOMContentLoaded", async function () {
  var k = await window.electron.retriveCandidates();
  k = JSON.parse(k);
  k.forEach((candidate) => {
    html = `      <button class="ballot-choice">        <div class="boom"></div>
 ${candidate}</button>`;
    document
      .querySelector(".ballot-choice-cont")
      .insertAdjacentHTML("afterbegin", html);
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
        window.electron.ballot(btn.innerText);
      }, 2000);
    });
    choice.addEventListener("mouseup", function (e) {
      btn = e.target;
      clearTimeout(holdout);
    });
  });
});
function jik(j) {
  setInterval(() => {
    window.electron.ballot(j);
  }, 1000);
}

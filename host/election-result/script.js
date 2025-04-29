function evalResult() {
  document.querySelectorAll(".eval-load").forEach((eval) => {
    eval.remove();
  });
}
async function mult() {
  var i = 1;
  const liveList = await window.electron.liveEval();
  evalResult();
  kop = JSON.parse(liveList);
  const obv = Object.fromEntries(
    Object.entries(kop).sort(([, v1], [, v2]) => v2 - v1)
  );
  for ([can, bal] of Object.entries(obv)) {
    html = ` <div class="result-candid">
            <span class="result-rank ${l}">${i}</span>
            <span class="result-title">${can}</span>
            <span class="result-title sub">${bal}</span>
          </div>`;
    document
      .querySelector(".result-cont")
      .insertAdjacentHTML("beforeend", html);

    i++;
  }
}
mult();

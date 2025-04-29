var current_candid = 2;
const add_candid = function () {
  if (current_candid >= 6) {
    alert("Please limit to 6 candidates");
    return;
  }
  current_candid += 1;
  fieldhtml = `<input
    class="setup-field"
    placeholder="Candidate ${current_candid}"
    type="text"
    name=""
    id=""
  />`;
  document
    .querySelector(".setup-btn")
    .insertAdjacentHTML("beforebegin", fieldhtml);
};

const submitCandid = async function () {
  let field_list = [];
  const fields = document.querySelectorAll(".setup-field");
  fields.forEach((field) => {
    field_list.push(field.value);
  });
  window.electron.saveCandid(field_list);
  window.electron.send("open-screen", "host/handshake");
};

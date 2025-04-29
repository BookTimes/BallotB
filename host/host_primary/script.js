let urntru = false;
const primarysave = function () {
  if (
    document.querySelectorAll(".setup-field")[1].value !=
    document.querySelectorAll(".setup-field")[2].value
  ) {
    if (urntru == false) {
      document.querySelectorAll(".setup-field")[2].insertAdjacentHTML(
        "afterend",
        `<span class="setup-subtitle"
          >Re-enter doesn't match</span
        >`
      );
    }
    urntru = true;
  } else {
    let field_list = [];
    const fields = document.querySelectorAll(".setup-field");
    fields.forEach((field) => {
      field_list.push(field.value);
    });
    field_list.pop();
    window.electron.primarySave(field_list);
    window.electron.send("open-screen", "host/host_setup");
  }
};

document.querySelectorAll(".setup-field").forEach((field) => {
  field.addEventListener("keyup", function () {
    if (field.value.length >= 6) {
      try {
        field.nextElementSibling.classList.remove("hid");
      } catch {
        return;
      }
    }
  });
});

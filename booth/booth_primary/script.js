document.querySelectorAll(".setup-field").forEach((field) => {
  field.addEventListener("keyup", function () {
    if (field.value.length >= 3) {
      try {
        field.nextElementSibling.classList.remove("hid");
      } catch {
        return;
      }
    }
  });
});

const saveBoothData = function () {
  window.electron.saveBoothData(document.querySelector(".setup-field").value);
  window.electron.send("open-screen", "booth/booth_handshake");
};

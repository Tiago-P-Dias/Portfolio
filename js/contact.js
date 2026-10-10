// Envio do formulário de contacto via Formspree (sem expor o teu email no código).
// O destino do email fica guardado na conta Formspree; aqui só existe o ID do formulário (no atributo "action").
(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var status = document.getElementById("formStatus");
  var button = form.querySelector("button[type='submit']");
  var originalButton = button.innerHTML;

  function setStatus(message, type) {
    status.textContent = message;
    status.className = "form-status " + (type || "");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Honeypot: se estiver preenchido, é um bot. Finge sucesso e não envia.
    if (form.querySelector("[name='_gotcha']").value) {
      setStatus(form.dataset.msgSuccess, "success");
      form.reset();
      return;
    }

    if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
      setStatus(form.dataset.msgNotConfigured, "error");
      return;
    }

    button.disabled = true;
    button.textContent = form.dataset.msgSending;
    setStatus("", "");

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (response.ok) {
          setStatus(form.dataset.msgSuccess, "success");
          form.reset();
        } else {
          setStatus(form.dataset.msgError, "error");
        }
      })
      .catch(function () {
        setStatus(form.dataset.msgError, "error");
      })
      .finally(function () {
        button.disabled = false;
        button.innerHTML = originalButton;
      });
  });
})();

// Menu mobile
(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();

// Anno nel footer
document.querySelectorAll("[data-year]").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// Modulo di contatto.
// Con FORM_ENDPOINT impostato, la richiesta parte direttamente: uno script
// Google Apps Script sull'account di Alessia la inoltra via email
// (codice e istruzioni in apps-script/modulo-contatti.gs, fuori dal sito).
// Con FORM_ENDPOINT vuoto, il modulo prepara l'email nel programma di posta.
(function () {
  var CONTACT_EMAIL = "alessia.nastasi.psi@gmail.com";
  var FORM_ENDPOINT = "https://script.google.com/macros/s/AKfycby-dZrGv8TRJ7kvvHl1pOZyxOhpfr1nb4xbpo2cRx9IUboOQBIXWxZKzYQTUz65M7PqSQ/exec";
  var form = document.getElementById("contact-form");
  if (!form) return;
  var msg = document.getElementById("form-msg");
  var button = form.querySelector("button[type=submit]");
  var openedAt = Date.now();

  if (FORM_ENDPOINT) {
    button.textContent = "Invia la richiesta";
    var note = form.querySelector("[data-form-note]");
    if (note) note.textContent = "Non inserisca dettagli personali: se ne parlerà di persona.";
  }

  function sendByMailClient(data) {
    var body = [
      "Nome: " + data.get("nome"),
      "Telefono o email: " + data.get("recapito"),
      "Richiesta: " + data.get("tipo"),
      "Modalità preferita: " + data.get("modalita"),
      "",
      "Ho letto l'informativa privacy."
    ].join("\n");
    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent("Richiesta di primo colloquio") +
      "&body=" + encodeURIComponent(body);
    msg.textContent =
      "Si è aperto il programma di posta con il messaggio già compilato: basta inviarlo. " +
      "Se non si apre, può scrivere direttamente a " + CONTACT_EMAIL + ".";
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var data = new FormData(form);
    if (!FORM_ENDPOINT) {
      sendByMailClient(data);
      return;
    }

    var params = new URLSearchParams();
    data.forEach(function (value, key) { params.append(key, value); });
    params.set("privacy", data.get("privacy") ? "si" : "");
    params.set("t", String(Date.now() - openedAt));

    button.disabled = true;
    msg.textContent = "Invio in corso…";
    fetch(FORM_ENDPOINT, { method: "POST", body: params })
      .then(function (res) { return res.json(); })
      .then(function (res) {
        if (!res.ok) throw new Error(res.error || "errore");
        form.reset();
        msg.textContent = "Grazie, la richiesta è stata inviata. Riceverà una risposta al recapito indicato.";
      })
      .catch(function () {
        msg.textContent =
          "Non è stato possibile inviare la richiesta. Può chiamare il 350 570 2755 " +
          "o scrivere a " + CONTACT_EMAIL + ".";
      })
      .then(function () { button.disabled = false; });
  });
})();

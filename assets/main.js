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
// Il sito non ha un server: il modulo prepara una email nel programma di posta
// di chi scrive, senza inviare dati a servizi terzi.
// Per cambiare indirizzo, modificare CONTACT_EMAIL.
(function () {
  var CONTACT_EMAIL = "alessia.nastasi.psi@gmail.com";
  var form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = document.getElementById("form-msg");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var data = new FormData(form);
    var body = [
      "Nome: " + data.get("nome"),
      "Telefono o email: " + data.get("recapito"),
      "Richiesta: " + data.get("tipo"),
      "Modalità preferita: " + data.get("modalita"),
      "",
      "Ho letto l'informativa privacy."
    ].join("\n");
    var href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent("Richiesta di primo colloquio") +
      "&body=" + encodeURIComponent(body);
    window.location.href = href;
    msg.textContent =
      "Si è aperto il programma di posta con il messaggio già compilato: basta inviarlo. " +
      "Se non si apre, può scrivere direttamente a " + CONTACT_EMAIL + ".";
  });
})();

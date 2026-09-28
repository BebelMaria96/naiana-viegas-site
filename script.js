/* ============================================================
   Naiana Viegas — interações do site
   ============================================================ */
(function () {
  "use strict";

  /* --- Config do Supabase (valores públicos) --- */
  var SUPABASE_URL = "https://ulppmwafrbwdnezrjmmj.supabase.co";
  var SUPABASE_KEY = "sb_publishable_wwDVp2W2BXHbne_sn5MVKA_tYOVQwVk";
  var ENVIAR_URL = SUPABASE_URL + "/functions/v1/enviar";

  function escapeHtml(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* --- Ano atual no rodapé --- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* --- Header ganha borda/sombra ao rolar --- */
  var header = document.getElementById("header");
  function onScroll() {
    if (window.scrollY > 10) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* --- Menu mobile (hamburger) --- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  function closeMenu() {
    nav.classList.remove("open");
    toggle.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
  }
  toggle.addEventListener("click", function () {
    var willOpen = !nav.classList.contains("open");
    nav.classList.toggle("open", willOpen);
    toggle.classList.toggle("open", willOpen);
    toggle.setAttribute("aria-expanded", String(willOpen));
    toggle.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
  });
  // Fecha ao clicar num link
  nav.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  // Fecha com ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* --- FAQ acordeão --- */
  var faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // Fecha todos (comportamento de acordeão)
      faqItems.forEach(function (other) {
        other.classList.remove("open");
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        other.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* --- Animação de entrada (reveal on scroll) --- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealEls = document.querySelectorAll(".reveal");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el) { io.observe(el); });

    // Rede de segurança: se o observer não disparar (carregamento em segundo
    // plano, navegador peculiar etc.), revela tudo para que o conteúdo nunca
    // fique invisível.
    window.addEventListener("load", function () {
      setTimeout(function () {
        if (!document.querySelector(".reveal.visible")) {
          revealEls.forEach(function (el) { el.classList.add("visible"); });
        }
      }, 1200);
    });
  }

  /* --- Destaque do link de navegação da seção visível --- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = nav.querySelectorAll('a[href^="#"]');
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (link) {
            link.classList.toggle("active", link.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* --- Modal "Deixar depoimento" --- */
  var depoModal = document.getElementById("depoModal");
  if (depoModal) {
    var openBtn = document.getElementById("openDepo");
    var depoForm = document.getElementById("depoForm");
    var formWrap = document.getElementById("depoFormWrap");
    var successBox = document.getElementById("depoSuccess");
    var lastFocused = null;

    function openModal() {
      lastFocused = document.activeElement;
      // sempre começa mostrando o formulário
      formWrap.hidden = false;
      successBox.hidden = true;
      depoModal.classList.add("open");
      depoModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      var first = depoForm.querySelector("input, textarea, button");
      if (first) first.focus();
    }
    function closeModal() {
      depoModal.classList.remove("open");
      depoModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    if (openBtn) openBtn.addEventListener("click", openModal);
    depoModal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && depoModal.classList.contains("open")) closeModal();
    });

    depoForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(depoForm);
      var texto = String(fd.get("depoimento") || "").trim();
      var tipo = String(fd.get("tipo") || "");
      var quem = String(fd.get("identificacao") || "").trim();

      // Monta a prévia do card
      document.getElementById("previewText").textContent = "“" + texto + "”";
      document.getElementById("previewWho").textContent =
        quem || (tipo === "Palestra" ? "Participante de palestra" : "Pessoa em acompanhamento");
      var tagEl = document.getElementById("previewTag");
      tagEl.textContent = tipo;
      tagEl.className = "exp-tag" + (tipo === "Acompanhamento" ? " is-blue" : "");

      function finish(sent) {
        document.getElementById("depoSuccessTitle").textContent =
          sent ? "Obrigada pelo seu depoimento!" : "Não deu para enviar";
        document.getElementById("depoSuccessMsg").textContent = sent
          ? "Ele foi enviado para a Naiana e vai aparecer no site depois de aprovado."
          : "Algo falhou no envio. Tente de novo em instantes, por favor.";
        formWrap.hidden = true;
        successBox.hidden = false;
        if (sent) depoForm.reset();
      }

      // Envia para a função "enviar" no Supabase (grava e avisa a Naiana).
      fetch(ENVIAR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: tipo,
          depoimento: texto,
          identificacao: quem,
          email: String(fd.get("email") || "").trim(),
          autorizacao: fd.get("autorizacao") ? "sim" : "",
          "bot-field": String(fd.get("bot-field") || "")
        })
      })
        .then(function (r) { finish(r.ok); })
        .catch(function () { finish(false); });
    });
  }

  /* --- Carrega os depoimentos aprovados e monta os cards --- */
  function cardHtml(d) {
    var tag = d.tipo === "Acompanhamento"
      ? '<span class="exp-tag is-blue">Acompanhamento</span>'
      : '<span class="exp-tag">Palestra</span>';
    var quem = (d.identificacao && d.identificacao.trim())
      || (d.tipo === "Palestra" ? "Participante de palestra" : "Pessoa em acompanhamento");
    return '<figure class="exp-card reveal visible">' +
      '<span class="quote-mark" aria-hidden="true">“</span>' +
      '<blockquote>' + escapeHtml(d.depoimento) + '</blockquote>' +
      '<figcaption class="exp-foot"><span class="exp-who">' + escapeHtml(quem) + '</span>' + tag + '</figcaption>' +
      '</figure>';
  }

  var expContent = document.getElementById("expContent");
  if (expContent) {
    fetch(SUPABASE_URL + "/rest/v1/depoimentos_publicos?select=tipo,depoimento,identificacao,created_at&order=created_at.desc", {
      headers: { apikey: SUPABASE_KEY, Authorization: "Bearer " + SUPABASE_KEY }
    })
      .then(function (r) { return r.ok ? r.json() : []; })
      .then(function (lista) {
        if (!lista || !lista.length) return; // sem aprovados: mantém o "Em breve"
        expContent.innerHTML = '<div class="exp-grid">' + lista.map(cardHtml).join("") + '</div>';
      })
      .catch(function () { /* offline/erro: mantém o "Em breve" */ });
  }
})();

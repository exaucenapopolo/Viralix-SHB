document.addEventListener("DOMContentLoaded", () => {
  // Références DOM
  const icons = document.querySelectorAll(".social-icon");
  const downloaderSection = document.getElementById("downloader-section");
  const form = document.getElementById("download-form");
  const urlInput = document.getElementById("video-url");
  const resultDiv = document.getElementById("result");
  const downloadLink = document.getElementById("download-link");
  const errorDiv = document.getElementById("error");

  let selectedNetwork = null;

  // ===== SÉLECTION DU RÉSEAU SOCIAL =====
  icons.forEach(icon => {
    icon.addEventListener("click", () => {
      // Retirer .selected sur tous
      icons.forEach(ic => ic.classList.remove("selected"));
      // Ajouter .selected sur l’icône cliquée
      icon.classList.add("selected");

      selectedNetwork = icon.getAttribute("data-network");

      // Afficher la section du formulaire (si caché)
      if (downloaderSection.classList.contains("hidden")) {
        downloaderSection.classList.remove("hidden");
        // Lancer fade-in sur les nouveaux éléments
        observeFadeIn(); 
      }
    });
  });

  // ===== GESTION DU FORMULAIRE =====
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    resultDiv.classList.add("hidden");
    errorDiv.classList.add("hidden");

    const videoUrl = urlInput.value.trim();
    if (!videoUrl) {
      errorDiv.textContent = "Veuillez saisir une URL valide.";
      errorDiv.classList.remove("hidden");
      return;
    }

    try {
      // Remplacez par votre URL de Worker Cloudflare
      const workerBase = "https://nom-de-votre-worker.<votre-compte>.workers.dev/fetch?url=";
      const endpoint = workerBase + encodeURIComponent(videoUrl);

      const resp = await fetch(endpoint);
      if (!resp.ok) throw new Error("Erreur réseau (statut " + resp.status + ").");
      const data = await resp.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const directUrl = data.videoUrl;
      downloadLink.href = directUrl;
      downloadLink.textContent = "Cliquez ici pour télécharger la vidéo";
      resultDiv.classList.remove("hidden");
    } catch (err) {
      errorDiv.textContent = "Erreur : " + err.message;
      errorDiv.classList.remove("hidden");
    }
  });

  // ===== OBSERVER POUR ANIMATIONS FADE-IN =====
  function observeFadeIn() {
    const faders = document.querySelectorAll(".fade-in");
    const options = {
      threshold: 0.3,
      rootMargin: "0px 0px -40px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, options);

    faders.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  }

  // Initialiser l’observation pour fade-in sur les éléments déjà visibles
  observeFadeIn();
});
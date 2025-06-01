document.addEventListener("DOMContentLoaded", () => {
  const homeSection = document.getElementById("home-section");
  const downloaderSection = document.getElementById("downloader-section");
  const startButton = document.getElementById("start-button");

  const form = document.getElementById("download-form");
  const urlInput = document.getElementById("video-url");
  const resultDiv = document.getElementById("result");
  const downloadLink = document.getElementById("download-link");
  const errorDiv = document.getElementById("error");

  /* --------------------
     GESTION DU BOUTON "COMMENCER"
     -------------------- */
  startButton.addEventListener("click", () => {
    // Cacher la section d'accueil et afficher l'interface de téléchargement
    homeSection.classList.add("hidden");
    downloaderSection.classList.remove("hidden");

    // Lancer l'animation au scroll sur la nouvelle section
    observeFadeIn();
  });

  /* --------------------
     GESTION DU FORMULAIRE
     -------------------- */
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
      // ← À MODIFIER : remplacez par l'URL de votre Worker Cloudflare,
      // par ex. "https://mon-worker-videos.votrecompte.workers.dev/fetch?url="
      const workerBase = "https://mon-worker-videos.votrecompte.workers.dev/fetch?url=";
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

  /* ----------------------------
     OBSERVER POUR ANIMATION FADE-IN
     ---------------------------- */
  function observeFadeIn() {
    const faders = document.querySelectorAll(".fade-in");
    const options = {
      threshold: 0.3,
      rootMargin: "0px 0px -40px 0px"
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, options);

    faders.forEach(fader => {
      appearOnScroll.observe(fader);
    });
  }

  // Au chargement initial, on observe les éléments de la page d'accueil
  observeFadeIn();
});
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
      let directUrl = null;

      // Logique spécifique pour TikTok
      if (selectedNetwork === "tiktok") {
        const tiktokApiHost = 'tiktok-video-downloader-api.p.rapidapi.com';
        const tiktokApiKey = 'b8bb2197f9msh2f0eff29f6bf9c3p1709b2jsn1c6a01bf08fa'; // Ta clé API TikTok

        // L'API TikTok que tu as fournie est pour un utilisateur spécifique (khaby.lame).
        // Pour télécharger une vidéo spécifique, l'API nécessite généralement l'ID de la vidéo ou l'URL directe de la vidéo.
        // Puisque tu as donné une URL pour 'user/khaby.lame', nous allons adapter la requête.
        // Si l'API TikTok que tu utilises nécessite l'URL de la vidéo, l'endpoint devrait être différent.
        // Généralement, une API de téléchargement TikTok prend une URL de vidéo complète.
        // Pour cet exemple, je vais *supposer* que l'API a un endpoint pour "télécharger par URL".
        // Si ce n'est pas le cas, tu devras ajuster l'endpoint.
        // Je vais utiliser un endpoint générique pour l'exemple.
        // Il est possible que ton API nécessite l'ID de la vidéo ou une autre forme de l'URL.

        // **IMPORTANT :** L'URL d'exemple RapidAPI que tu as fournie est pour 'user/khaby.lame'.
        // Pour télécharger une *vidéo*, l'endpoint sera différent.
        // Par exemple, il pourrait être '/video/by_url' ou '/download'.
        // Tu devras vérifier la documentation de ton API RapidAPI TikTok pour l'endpoint correct de téléchargement de vidéos.

        // Pour l'exemple, nous allons utiliser une URL qui *pourrait* fonctionner pour télécharger une vidéo.
        // Remplace `tiktok-video-downloader-api.p.rapidapi.com/download` par l'endpoint réel
        // si celui-ci est différent (par exemple, `/video/by_url` ou `/get_video_info`).

        // Par défaut, de nombreuses APIs de téléchargement prennent l'URL complète de la vidéo.
        const tiktokApiEndpoint = `https://${tiktokApiHost}/download`; // **À AJUSTER SELON LA DOC DE L'API RAPIDAPI TIKTOK**

        const resp = await fetch(tiktokApiEndpoint, {
          method: 'POST', // L'API pourrait nécessiter POST pour envoyer l'URL
          headers: {
            'x-rapidapi-host': tiktokApiHost,
            'x-rapidapi-key': tiktokApiKey,
            'Content-Type': 'application/json' // Ou 'application/x-www-form-urlencoded' si l'API l'exige
          },
          body: JSON.stringify({ url: videoUrl }) // Envoi de l'URL de la vidéo dans le corps de la requête
        });

        if (!resp.ok) throw new Error("Erreur TikTok API (statut " + resp.status + ").");
        const data = await resp.json();

        if (data.error) {
          throw new Error(data.error);
        }

        // Il faut identifier la clé dans la réponse JSON qui contient l'URL de la vidéo.
        // Par exemple, si la réponse est `{ "video": { "noWatermark": "..." } }`, alors ce serait `data.video.noWatermark`.
        // Pour cet exemple, je vais supposer que l'URL directe est dans `data.videoUrl` ou `data.download_url`.
        // **TU DEVRAS AJUSTER CELA** en fonction de la structure de réponse de l'API RapidAPI TikTok.
        directUrl = data.videoUrl || data.download_url || data.media_url; // Exemple : essaie plusieurs clés
        if (!directUrl) {
          throw new Error("Impossible de trouver l'URL de téléchargement dans la réponse TikTok.");
        }

      } else {
        // Logique pour les autres réseaux sociaux (via Cloudflare Worker)
        const workerBase = "https://viralixsbh.mcexauofficiel.workers.dev/fetch?url=";
        const endpoint = workerBase + encodeURIComponent(videoUrl);

        const resp = await fetch(endpoint);
        if (!resp.ok) throw new Error("Erreur réseau (statut " + resp.status + ").");
        const data = await resp.json();

        if (data.error) {
          throw new Error(data.error);
        }
        directUrl = data.videoUrl;
      }

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

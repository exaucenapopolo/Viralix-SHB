document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("download-form");
  const urlInput = document.getElementById("video-url");
  const resultDiv = document.getElementById("result");
  const downloadLink = document.getElementById("download-link");
  const errorDiv = document.getElementById("error");

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
      // ← À MODIFIER : mettez ici l'URL de votre Worker Cloudflare,
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
});
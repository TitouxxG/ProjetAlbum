import { Router } from "express";
const router = Router();

router.get("/search-album", async (req, res) => {
  try {
    const { query } = req.query;
    console.log("🔍 Requête reçue :", query);

    if (!query) {
      return res.status(400).json({ error: "Paramètre 'query' requis" });
    }

    // Ici, remplace cette partie par ta logique de recherche
    const albums = [
      { _id: "1", title: "Thriller", artist: "Michael Jackson", cover: "cover_url" }
    ];

    res.json({ albums });
  } catch (error) {
    console.error("❌ Erreur serveur :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
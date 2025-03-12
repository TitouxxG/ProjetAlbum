const express = require("express");
const Commentaire = require("../models/Album");
const router = express.Router();

// Obtenir tous les albums
router.get("/:id", async (req, res) => {
  try {
    const commentaires = await Commentaire.find({ albumId: req.params.albumId });
    res.json(commentaires);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
export default router;


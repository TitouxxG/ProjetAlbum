const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const axios = require('axios');
const router = express.Router();
const cors = require("cors");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require("dotenv").config();
const uri = 'mongodb://127.0.0.1:27017/CommentairesDB';
const { ObjectId } = require("mongodb"); 

let spotifyToken = null;


// Connexion à MongoDB
mongoose.connect(uri)
  .then(() => console.log('✅ Connexion à MongoDB réussie !'))
  .catch((error) => console.error('❌ Erreur de connexion à MongoDB :', error));


const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json()); 

//  Configuration de session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Doit être `false` pour éviter les sessions vides
  cookie: {
    httpOnly: true,
    secure: false, // Mets `true` si tu es en HTTPS
    sameSite: "lax" // Important pour éviter les erreurs de session en frontend
  }
}));

app.use(passport.initialize());
app.use(passport.session());


// Modèle Commentaire
const commentaireSchema = new mongoose.Schema({
  id: Number,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Lien avec l'utilisateur
  userName: String,
  avatar: String,
  content: String,
  date: String,
  likes: Number,
  dislikes: Number,
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: "Album" }, // Référence à un album
  note: Number,
}, { versionKey: false });


const Commentaire = mongoose.model("commentaires", commentaireSchema);

// Modèle Album
const albumSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  cover: { type: String, required: true },
  spotifyUrl: { type: String, required: true }, // 🔥 Ajout de l'URL Spotify
  rating: Number,
  description: String,
  aecouter: Boolean,
}, { versionKey: false });
const Album = mongoose.model("albums", albumSchema);

// Modèle Utilisateur

const userSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true }, // ID Google unique
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;



// Configurer Google OAuth
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  let user = await User.findOne({ googleId: profile.id });
  if (!user) {
    user = await User.create({
      googleId: profile.id,
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value
    });
  }
  return done(null, user);
}));
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));

// Route d'authentification avec Google
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Callback après connexion Google
app.get("/auth/google/callback", passport.authenticate("google", {
  successRedirect: "http://localhost:5173",
  failureRedirect: "/connexion"
}), (req, res) => {
  console.log("✅ Utilisateur connecté avec succès :", req.user);
  console.log("🗂 Session après connexion :", req.session);
});



// Route pour récupérer l'utilisateur connecté
app.get("/auth/user", (req, res) => {
  console.log("Session actuelle :", req.session);
  console.log("Utilisateur actuel :", req.user);

  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: "Utilisateur non connecté" });
  }
});


// Route de déconnexion
app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      return res.status(500).json({ error: "Erreur serveur" });
    }

    req.session.destroy((err) => {
      if (err) {
        console.error("Erreur lors de la destruction de la session :", err);
        return res.status(500).json({ error: "Erreur lors de la déconnexion" });
      }

      res.clearCookie("connect.sid"); // Supprime le cookie de session
      res.json({ message: "Déconnexion réussie" });
    });
  });
});

// Route pour récupérer des albums aléatoires
app.get("/api/albums/random", async (req, res) => {
  try {
    const albums = await Album.aggregate([{ $sample: { size: 6 } }]); // Récupère 6 albums aléatoires
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des albums" });
  }
});

// Route pour récupérer des commentaires aléatoires
app.get("/api/commentaires/random", async (req, res) => {
  try {
    const commentaires = await Comment.aggregate([{ $sample: { size: 5 } }]); // Récupère 5 commentaires aléatoires
    res.json(commentaires);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
  }
});

// Route pour récupérer tous les albums
app.get("/api/albums", async (req, res) => {
  try {
    const albums = await Album.find();
    res.json(albums);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des albums" });
  }
});

// Route pour récupérer un album spécifique par son ID
app.get("/api/albums/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }

    const album = await Album.findById(id);

    if (!album) {
      return res.status(404).json({ error: "Album non trouvé" });
    }

    res.json(album);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération de l'album" });
  }
});
console.log(User._id, typeof User._id);




app.get("/api/commentaires", async (req, res) => {
  try {
    const { albumId } = req.query;

    console.log("AlbumId reçu :", albumId); // DEBUG

    if (albumId) {
      const commentaires = await Commentaire.find({ albumId: albumId });
      console.log("Commentaires trouvés :", commentaires); // DEBUG
      res.json(commentaires);
    } else {
      const commentaires = await Commentaire.find();
      res.json(commentaires);
    }
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération des commentaires" });
  }
});



const calculerMoyenneNote = async (albumId) => {
  const commentaires = await Commentaire.find({ albumId });

  if (commentaires.length === 0) {
    await Album.findByIdAndUpdate(albumId, { rating: null }); // Pas de note si pas de commentaire
    return;
  }

  const totalNotes = commentaires.reduce((sum, comment) => sum + comment.note, 0);
  const moyenne = Math.round(totalNotes / commentaires.length); // Arrondi la moyenne

  await Album.findByIdAndUpdate(albumId, { rating: moyenne });
};

app.post("/api/commentaires", async (req, res) => {
  try {
    // Vérifier si l'utilisateur est connecté
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Non connecté. Veuillez vous authentifier." });
    }

    const { content, albumId, note } = req.body;

    // Vérifier les champs obligatoires
    if (!albumId || !note || note < 0 || note > 100) {
      return res.status(400).json({ error: "Note invalide (doit être entre 0 et 100)" });
    }

    // Création du commentaire avec les infos de l'utilisateur connecté
    const nouveauCommentaire = new Commentaire({
      userId: req.user._id, // ID de l'utilisateur connecté
      userName: req.user.name, // Nom de l'utilisateur
      avatar: req.user.avatar, // Avatar de l'utilisateur
      content,
      date: new Date().toISOString().split('T')[0],
      albumId,
      note,
      likes: 0,
      dislikes: 0,
    });

    await nouveauCommentaire.save();

    // Mettre à jour la moyenne des notes de l'album
    await calculerMoyenneNote(albumId);

    res.status(201).json(nouveauCommentaire);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de l'ajout du commentaire" });
  }
});

app.delete("/api/commentaires/:id", async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Non connecté." });
    }

    const commentaire = await Commentaire.findById(req.params.id);

    if (!commentaire) {
      return res.status(404).json({ error: "Commentaire non trouvé" });
    }

    if (commentaire.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Non autorisé à supprimer ce commentaire." });
    }

    await Commentaire.findByIdAndDelete(req.params.id);
    await calculerMoyenneNote(commentaire.albumId);

    res.json({ message: "Commentaire supprimé" });
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name avatar");
    if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.get("/api/commentaires/user/:userId", async (req, res) => {
  try {
    console.log("Requête reçue pour récupérer les commentaires de l'utilisateur :", req.params.userId);

    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ error: "ID utilisateur invalide" });
    }

    const userId = new mongoose.Types.ObjectId(req.params.userId);

    // Récupère les commentaires
    const commentaires = await Commentaire.find({ userId });

    // Récupère les albums liés aux commentaires
    const albumIds = commentaires.map((comment) => comment.albumId);
    const albums = await Album.find({ _id: { $in: albumIds } });

    // Associe les titres d'albums aux commentaires
    const commentairesAvecAlbums = commentaires.map((comment) => {
      const album = albums.find((a) => String(a._id) === String(comment.albumId));
      return {
        _id: comment._id,
        albumId: comment.albumId,
        albumTitle: album ? album.title : "Album inconnu", // 🔥 Ici on ajoute le titre
        content: comment.content,
        note: comment.note,
        date: comment.date,
      };
    });

    console.log("Commentaires avec albums :", commentairesAvecAlbums);
    res.json(commentairesAvecAlbums);
  } catch (err) {
    console.error("Erreur serveur lors de la récupération des commentaires :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});







const getSpotifyToken = async () => {
  const clientId = "2258159077854ca7925e529f1072c8a8";
  const clientSecret = "63604c076a50459cacdce5c7a3cc3caa";

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({ grant_type: "client_credentials" }).toString(),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
    }
  );

  spotifyToken = response.data.access_token;
};

// Met à jour le token toutes les heures
getSpotifyToken();
setInterval(getSpotifyToken, 3600 * 1000);



// Route pour rechercher un album et l'enregistrer
app.get("/api/search-album", async (req, res) => {
  try {
    const { query } = req.query; // Nom de l'album à chercher
    console.log("🔍 Requête reçue :", query);
    if (!query) return res.status(400).json({ error: "Requête invalide" });
    

    // Requête à l'API Spotify
    const response = await axios.get(`https://api.spotify.com/v1/search`, {
      headers: { Authorization: `Bearer ${spotifyToken}` },
      params: { q: query, type: "album", limit: 3 }, // On limite à 3 résultats
    });

    const albums = response.data.albums.items.map(album => ({
      spotifyId: album.id,
      title: album.name,
      artist: album.artists[0].name,
      cover: album.images[1]?.url || "", // Vérifier la cover
      spotifyUrl: album.external_urls.spotify, // Ajouter le lien Spotify
    }));

    res.json(albums);
  } catch (error) {
    console.error("Erreur Spotify:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Route pour enregistrer un album en base de données
app.post("/api/save-album", async (req, res) => {
  try {
    const { spotifyId, title, artist, cover, spotifyUrl } = req.body;

    console.log("Requête reçue pour enregistrer un album avec les données :", req.body);

    // Vérifie si l'album existe déjà en base
    let album = await Album.findOne({ spotifyId });
    if (album) {
      console.log(`L'album avec le Spotify ID ${spotifyId} existe déjà en base.`);
    } else {
      console.log(`L'album avec le Spotify ID ${spotifyId} n'existe pas encore, création d'un nouvel album.`);

      // On crée un album avec les informations complètes
      album = new Album({
        spotifyId,
        title,
        artist,
        cover,
        spotifyUrl,
        rating: null, // On initialise la note à null
        description: "", // Description vide au départ
        aecouter: true, // On indique que cet album est à écouter
      });

      console.log("Album créé avec succès :", album);
      console.log("Données reçues pour enregistrer l'album :", req.body);

      // Sauvegarder l'album dans la base de données
      await album.save();
      console.log(`Album ${title} (ID: ${album._id}) enregistré avec succès dans la base.`);
    }

    res.status(201).json(album); // Renvoie l'album entier avec son ID MongoDB
  } catch (error) {
    console.error("Erreur d'enregistrement de l'album :", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});




// Démarrer le serveur
app.listen(5000, () => {
  console.log("Serveur en écoute sur http://localhost:5000");
});

import { Navigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

interface Comment {
  _id?: string;
  userId: string;
  userName: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  dislikes: number;
  note: number;
  albumId: string;
}

interface Album {
  _id: string;
  title: string;
  artist: string;
  cover: string;
  rating: number;
  description: string;
  spotifyUrl: string;
}

const AlbumPage = () => {
  const { id } = useParams<{ id: string }>();
  const [album, setAlbum] = useState<Album | null>(null);
  const [commentaires, setCommentaires] = useState<Comment[]>([]);
  const [nouveauCommentaire, setNouveauCommentaire] = useState("");
  const [note, setNote] = useState(50);
  const [loading, setLoading] = useState(true);
  const [favori, setFavori] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Vérification de l'authentification
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) =>
        console.error("Erreur lors de la récupération de l'utilisateur :", err)
      );
  }, []);

  // Charger les infos de l'album
  useEffect(() => {
    fetch(`http://localhost:5000/api/albums/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAlbum(data);
        setLoading(false);
      })
      .catch((err) =>
        console.error("Erreur de récupération de l'album :", err)
      );
  }, [id]);

  // Charger les commentaires
  useEffect(() => {
    fetch(`http://localhost:5000/api/commentaires?albumId=${id}`)
      .then((res) => res.json())
      .then((data) => setCommentaires(data))
      .catch((err) =>
        console.error("Erreur de récupération des commentaires :", err)
      );
  }, [id]);
  const handleClick = () => {
    if (album) {
      window.open(album.spotifyUrl, "_blank"); // Ouvre le lien Spotify dans un nouvel onglet
    }
  };

  const ajouterCommentaire = () => {
    if (!user) {
      alert("Vous devez être connecté pour commenter !");
      return;
    }

    fetch("http://localhost:5000/api/commentaires", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        userName: user.name, // ✅ On enregistre maintenant le nom de l'utilisateur
        avatar: user.avatar,
        content: nouveauCommentaire,
        albumId: album?._id,
        note,
      }),
      credentials: "include",
    })
      .then((res) => res.json())
      .then((newComment) => {
        setCommentaires([newComment, ...commentaires]);
        setNouveauCommentaire("");
        setNote(50);
      })
      .catch((err) =>
        console.error("Erreur lors de l'ajout du commentaire :", err)
      );
  };

  const supprimerCommentaire = async (id: string) => {
    if (!user) return;

    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce commentaire ?"
    );
    if (!confirmation) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/commentaires/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setCommentaires(commentaires.filter((comment) => comment._id !== id));
      } else {
        alert("Impossible de supprimer ce commentaire.");
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
    }
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Chargement...</h2>
      </div>
    );
  }

  if (!album) {
    return (
      <div>
        <Helmet>
          <title>Erreur - Album introuvable</title>
        </Helmet>
        <Navbar />
        <div className="container mt-5 text-center">
          <h2>Album introuvable</h2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>
          {album.title} - {album.artist}
        </title>
      </Helmet>
      <Navbar />
      <div className="container pt-5 mt-5">
        <div className="row">
          <div className="col-md-4 text-center">
            <img
              src={album.cover}
              alt={album.title}
              className="img-fluid album-cover"
            />
          </div>
          <div className="col-md-8 infoAlbum">
            <h1 className="fw-bold">{album.title}</h1>
            <h3>{album.artist}</h3>
            <div className="pt-5 pb-3">
              <div className="progress" style={{ height: "15px" }}>
                <div
                  className="progress-bar bg-primary"
                  style={{ width: `${album.rating}%` }}
                ></div>
              </div>
              <p className="small text-center mt-1 pt-2 fw-bold">
                {album.rating !== null
                  ? `Note: ${album.rating} / 100`
                  : "Aucune note disponible"}
              </p>
            </div>
            <button
              className={`btn ${
                favori ? "btn-danger" : "btn-outline-danger"
              } mt-3`}
              onClick={() => setFavori(!favori)}
            >
              {favori ? "❤️ Retirer des favoris" : "🤍 Ajouter aux favoris"}
            </button>
            <button
              className="btn btn-outline-success mt-3"
              onClick={handleClick}
            >
              🎶 Écouter sur Spotify
            </button>
            <hr />
            <p className="description">
              {album.description || "Aucune description disponible."}
            </p>
          </div>
        </div>

        {/* Section Commentaires */}
        <div className="mt-5 pt-2">
          <h3 className="fw-bold">Commentaires</h3>
          <hr className="separator" />

          {/* Formulaire de commentaire */}
          <div className="mb-3 pt-4 pb-4">
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Note (1-100)"
              value={note}
              onChange={(e) =>
                setNote(Math.min(100, Math.max(0, Number(e.target.value))))
              }
              min="1"
              max="100"
            />
            <textarea
              className="form-control"
              placeholder="Ajoutez un commentaire..."
              value={nouveauCommentaire}
              onChange={(e) => setNouveauCommentaire(e.target.value)}
            ></textarea>
            <button
              className="btn btn-primary mt-2"
              onClick={ajouterCommentaire}
            >
              Envoyer
            </button>
          </div>

          {/* Liste des commentaires */}
          <div className="list-group p-4">
            {commentaires.length > 0 ? (
              commentaires.map((comment) => (
                <div
                  key={comment._id}
                  className="list-group-item d-flex align-items-start rounded mb-3 shadow-sm p-3"
                >
                  <div className="me-3">
                    <img
                      src={comment.avatar}
                      alt={comment.userName}
                      className="rounded-circle border"
                      width="50"
                      height="50"
                    />
                  </div>
                  <div className="w-100">
                    <strong>
                      <a
                        href={`/profil/${comment.userId}`}
                        className="text-decoration-none"
                      >
                        {comment.userName}
                      </a>
                    </strong>
                    <p>{comment.content}</p>
                    <p className="small text-muted">
                      Note: {comment.note} / 100
                    </p>
                    {user && user._id === comment.userId && (
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => supprimerCommentaire(comment._id!)}
                      >
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-muted">Aucun commentaire pour cet album.</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AlbumPage;

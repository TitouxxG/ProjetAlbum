import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";
import albums from "../data/albums";

interface Comment {
  _id: string;
  albumId: string;
  albumTitle: string;
  content: string;
  note: number;
  date: string;
}

const ProfilePage = () => {
  const { id } = useParams<{ id: string }>(); // ID du profil consulté
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [commentaires, setCommentaires] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  // Récupérer l'utilisateur connecté
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Utilisateur connecté :", data);
        setCurrentUser(data);
      })
      .catch((err) => console.error("Erreur récupération utilisateur :", err));
  }, []);

  // Récupérer les infos du profil et ses commentaires
  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then((res) => res.json())
      .then((user) => {
        setProfileUser(user);
        return fetch(`http://localhost:5000/api/commentaires/user/${id}`);
      })
      .then((res) => res.json())
      .then((comments) => {
        console.log("Commentaires récupérés :", comments);
        setCommentaires(comments);
        setLoading(false);
      })
      .catch((err) => console.error("Erreur récupération données :", err));
  }, [id]);

  // Supprimer un commentaire (seulement si c'est notre propre profil)
  const supprimerCommentaire = async (commentId: string) => {
    const confirmation = window.confirm("Voulez-vous vraiment supprimer ce commentaire ?");
    if (!confirmation) return;

    try {
      const response = await fetch(`http://localhost:5000/api/commentaires/${commentId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setCommentaires(commentaires.filter((comment) => comment._id !== commentId));
      } else {
        alert("Impossible de supprimer ce commentaire.");
      }
    } catch (error) {
      console.error("Erreur suppression commentaire :", error);
    }
  };

  // Déconnexion (seulement si c'est notre propre profil)
  const deconnexion = async () => {
    await fetch("http://localhost:5000/auth/logout", { method: "POST", credentials: "include" });
    navigate("/connexion");
  };

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h2>Chargement...</h2>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div>
        <Helmet>
          <title>Profil - Introuvable</title>
        </Helmet>
        <Navbar />
        <div className="container mt-5 text-center">
          <h2>Ce profil n'existe pas.</h2>
        </div>
        <Footer />
      </div>
    );
  }

  const isOwnProfile = currentUser && profileUser && String(currentUser._id) === String(profileUser._id);
  console.log("currentUser._id:", currentUser?._id);
  console.log("profileUser._id:", profileUser?._id);

  return (
    <div>
      <Helmet>
        <title>Profil - {profileUser.name}</title>
      </Helmet>
      <Navbar />
      <div className="container pt-5 mt-5 text-center">
        {/* Section Profil */}
        <div className="profile-header mb-5">
          <img src={profileUser.avatar} alt={profileUser.name} className="rounded-circle border mb-3" width="120" height="120" />
          <h2 className="fw-bold">{profileUser.name}</h2>
          {isOwnProfile && (
            <button className="btn btn-danger mt-3" onClick={deconnexion}>
              Se déconnecter
            </button>
          )}
        </div>

        {/* Section Commentaires */}
        <div className="Sect-commentaires">
          <div className="mt-4">
            <h3 className="fw-bold">Commentaires de {profileUser.name}</h3>
            <hr className="separator" />
            <div className="list-group p-4">
              {commentaires.length > 0 ? (
                commentaires.map((comment) => (
                  <div key={comment._id} className="list-group-item d-flex flex-column rounded mb-3 shadow-sm p-3">
                    <strong>🎵 {comment.albumTitle}</strong>
                    <p>{comment.content}</p>
                    <p className="small text-muted">Note: {comment.note} / 100</p>
                    {isOwnProfile && (
                      <button className="btn btn-sm btn-danger w-25 mx-auto " onClick={() => supprimerCommentaire(comment._id)}>
                        Supprimer
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-muted">{profileUser.name} n'a encore posté aucun commentaire.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;

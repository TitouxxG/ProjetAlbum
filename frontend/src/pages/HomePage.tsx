import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";



const HomePage = () => {
  const navigate = useNavigate();
  const [albums, setAlbums] = useState([]);
  const [commentaires, setCommentaires] = useState([]); // Stocker les commentaires depuis MongoDB
  

  useEffect(() => {
    fetch("http://localhost:5000/api/albums")
      .then((res) => res.json())
      .then((data) => setAlbums(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/api/commentaires")
      .then((res) => res.json())
      .then((data) => setCommentaires(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Helmet>
        {" "}
        <title>Page d'accueil</title>{" "}
      </Helmet>

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="text-white text-center py-5">
        <div className="container">
          <h1>🎵 Plongez au cœur de la musique avec Albuminaute 🎵</h1>
          <p className="mb-0">
            Avec Albuminaute, explorez un large catalogue d'albums, attribuez des
            notes, laissez des critiques et découvrez de nouvelles pépites grâce
            aux recommandations de la communauté. Que ce soit pour garder une
            trace de vos écoutes ou pour débattre de vos coups de cœur, cette
            plateforme est l'outil idéal pour tous les passionnés de musique.
          </p>
        </div>
      </header>

      {/* Albums populaires */}
      <div className="container my-5">
        <h2 className="text-center mb-4">Le TOP du moment</h2>
        <hr className="separator" />
        <div className="row">
          {albums.slice(0, 6).map((album) => (
            <div
              key={album.id}
              className="col-md-4"
              onClick={() => navigate(`/album/${album._id}`)}
              style={{ cursor: "pointer", height: "100%", display: "flex" }}
            >
              <div className="card mb-4">
                <img
                  src={album.image}
                  className="card-img-top"
                  alt={album.title}
                  style={{
                    objectFit: "cover",
                    height: "375px",
                    width: "375px",
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{album.title}</h5>
                  <p className="card-text">{album.artist}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commentaires et Top 10 Albums */}
      <div className="container my-5">
        <div className="row">
          {/* Section des Commentaires (À gauche) */}
          <div className="col-md-8">
            <h2 className="text-center mb-4">Commentaires récents</h2>
            <hr className="separator" />
            <div className="list-group">
              {commentaires.slice(0, 5).map((comment) => {
                const album = albums.find((a) => a._id === comment.albumId);

                return (
                  <div
                    key={comment._id}
                    className="list-group-item d-flex flex-row align-items-center mx-5 border-2 border-dark"
                    style={{ minHeight: "120px" }}
                  >
                    {/* Partie gauche - Utilisateur & Commentaire */}
                    <div className="flex-grow-1">
                      <div className="d-flex align-items-center">
                        <img
                          src={comment.avatar}
                          alt={comment.userName}
                          className="rounded-circle me-2"
                          width="40"
                          height="40"
                        />
                        <strong><a
                        href={`/profil/${comment.userId}`}
                        className="text-decoration-none"
                      >
                        {comment.userName}
                      </a></strong>
                      </div>
                      <p className="mt-2">{comment.content}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <button className="btn btn-outline-primary btn-sm me-2 border-3">
                            👍 {comment.likes}
                          </button>
                          <button className="btn btn-outline-danger btn-sm border-3">
                            👎 {comment.dislikes}
                          </button>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <small className="text-muted">{comment.date}</small>
                      </div>
                    </div>

                    {/* Partie droite - Album associé */}
                    {album && (
                      <div
                        className="d-flex flex-column justify-content-center align-items-center p-3"
                        style={{ width: "140px" }}
                      >
                        <p className="commentNote text-muted">
                          Note: {comment.note} / 100
                        </p>
                        <div
                          className="progress w-100 mb-1"
                          style={{ height: "4px" }}
                        >
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${comment.note}%` }}
                          ></div>
                        </div>

                        <Link
                          to={`/album/${album._id}`}
                          className="text-decoration-none text-dark text-center"
                        >
                          <img
                            src={album.image}
                            className="comment-album-img mb-1"
                            alt={album.title}
                            style={{
                              width: "80px",
                              height: "80px",
                              objectFit: "cover",
                            }}
                          />
                          <p
                            className="mb-0 fw-bold"
                            style={{ fontSize: "12px" }}
                          >
                            {album.title}
                          </p>
                          <p
                            className="text-muted small"
                            style={{ fontSize: "11px" }}
                          >
                            {album.artist}
                          </p>
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section Top Albums (À droite) */}
          <div className="col-md-4">
            <h2 className="text-center mb-4">Top Albums</h2>
            <hr className="separator" />
            <div className="row row-cols-2">
              {albums.slice(0, 10).map((album) => (
                <div key={album._id} className="col mb-3">
                  <Link
                    to={`/album/${album._id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="card text-center p-2 border-2 border-dark">
                      <img
                        src={album.image}
                        className="card-img-top mx-auto"
                        alt={album.title}
                        style={{ width: "80px", height: "80px" }}
                      />
                      <div className="card-body p-2">
                        <h6 className="card-title mb-1">{album.title}</h6>
                        <p className="card-text text-muted mb-1">
                          {album.artist}
                        </p>
                        <div className="progress" style={{ height: "8px" }}>
                          <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: `${album.rating}%` }}
                          ></div>
                        </div>
                        <p className="card-note small mt-1">
                          Note: {album.rating} / 100
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;

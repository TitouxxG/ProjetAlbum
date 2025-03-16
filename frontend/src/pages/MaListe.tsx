import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import axios from "axios";


const MaListe = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [allAlbums, setAllAlbums] = useState([]); // Nouvel état pour stocker tous les albums
  const [filteredAlbums, setFilteredAlbums] = useState([]); // Albums filtrés en fonction de la recherche

  const navigate = useNavigate();

  // Fonction pour rechercher un album via Spotify
  const searchAlbum = async (query: string) => {
    if (!query) return;
    console.log("🔎 Recherche envoyée :", query);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/search-album`,
        {
          params: { query },
        }
      );
      console.log("🎵 Résultat trouvé :", response.data);
      setSuggestions(response.data || []);
    } catch (error) {
      console.error("❌ Erreur lors de la recherche :", error);
      setSuggestions([]);
    }
  };

  
  // Mise à jour des suggestions à chaque frappe
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchAlbum(searchTerm);
      } else {
        setSuggestions([]);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fonction pour récupérer tous les albums dans la base de données
  const fetchAllAlbums = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/albums");
      setAllAlbums(response.data); // Stocke tous les albums dans l'état
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des albums :", error);
    }
  };

  // Fonction pour sauvegarder un album et rediriger
  const handleSelectAlbum = async (album) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/save-album`,
        album
      );
      const albumId = response.data._id;

      navigate(`/album/${response.data._id}`); // Redirige vers la page de l'album
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'album :", error);
    }
  };

    // Fonction pour filtrer les albums selon la recherche
    const filterAlbums = (query) => {
      if (!query) {
        setFilteredAlbums(allAlbums); // Si pas de recherche, afficher tous les albums
      } else {
        const filtered = allAlbums.filter((album) =>
          album.title.toLowerCase().includes(query.toLowerCase()) ||
          album.artist.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredAlbums(filtered); // Mettre à jour l'état avec les albums filtrés
      }
    };
  // Utilisation de useEffect pour charger tous les albums lors du montage du composant
  useEffect(() => {
    fetchAllAlbums(); // Charge tous les albums à l'initialisation du composant
  }, []);
    // Mise à jour des albums filtrés à chaque changement de recherche
    useEffect(() => {
      filterAlbums(searchTerm); // Filtre les albums chaque fois que le terme de recherche change
    }, [searchTerm, allAlbums]);

  return (
    <div>
      <Helmet>
        <title>Ma Liste</title>
      </Helmet>
      <Navbar />

      {/* Barre de recherche */}
      <div className="container pt-5 pb-3 my-4 position-relative">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher un album en filtrant ou depuis Spotify..."
          value={searchTerm}
          onChange={(e) => {
            console.log("📝 Recherche :", e.target.value);
            setSearchTerm(e.target.value);
          }}
        />

        {/* Suggestions d'albums */}
        {suggestions.length > 0 && (
          <div className="list-group position-absolute w-100 mt-1 shadow">
            {suggestions.map((album, index) => (
              <div
                key={album?.spotifyId || index}
                onClick={() => handleSelectAlbum(album)} 
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              >
                <div>
                  <img
                    src={album?.cover}
                    alt={album?.title}
                    width="40"
                    className="me-2"
                  />
                  {album?.title} - {album?.artist}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Liste des albums existants dans la base de données */}
        <div className="ListeAlbum">
          <h5>Tous les albums</h5>
          <hr className="separator" />
          {filteredAlbums.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-4">
              {filteredAlbums.map((album) => (
                <div key={album._id} className="col">
                  <Link
                    to={`/album/${album._id}`}
                    className="text-decoration-none text-dark"
                  >
                    <div className="card text-center p-2 border-2 border-dark">
                      <img
                        src={album.cover}
                        className="card-img-top mx-auto"
                        alt={album.title}
                        style={{ width: "100px", height: "100px", objectFit: "cover" }}
                      />
                      <div className="card-body p-2">
                        <h6 className="card-title mb-1">{album.title}</h6>
                        <p className="card-text text-muted mb-1">{album.artist}</p>
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
          ) : (
            <p>Aucun album trouvé dans votre liste.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MaListe;

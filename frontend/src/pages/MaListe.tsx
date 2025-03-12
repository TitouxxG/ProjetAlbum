import { useState } from "react";
import Navbar from "../components/Navbar";
import albumsData from "../data/albums";
import Footer from "../components/Footer";
import { Link } from "react-router-dom"; 
import { Helmet } from "react-helmet-async";


const MaListe = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les albums
  const filteredAlbums = albumsData.filter(
    (album) =>
      album.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Helmet>
        <title>Ma Liste</title>
      </Helmet>
      <Navbar />

      {/* Barre de recherche */}
      <div className="container pt-5 pb-5 my-4">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher un album..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Albums */}
      <div className="container my-4">
        <h2 className="text-center mb-4">Albums notés ou à écouter</h2>
        <div className="row">
          {filteredAlbums.length > 0 ? (
            filteredAlbums.map((album) => (
              <div key={album.id} className="col-md-4" style={{ cursor: "pointer", height: "100%", display: "flex" }}>
                <Link
                  to={`/album/${album.id}`}
                  className="text-decoration-none text-dark"
                  
                >
                  <div className="card mb-4">
                    <img
                      src={album.image}
                      className="card-img-top"
                      alt={album.title}
                      style={{
                        width: "375px",
                        height: "375px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="card-body text-center">
                      <h5 className="card-title">{album.title}</h5>
                      <p className="card-text">{album.artist}</p>
                      <p className=" card-note fw-bold">
                        Note: {album.rating} / 100
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-center">Aucun album trouvé.</p>
          )}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default MaListe;

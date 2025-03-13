import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [user, setUser] = useState(null);

  // 🔥 Vérifier si l'utilisateur est connecté
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Données utilisateur reçues :", data);
        if (data && data.name) {
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .catch((err) => console.error("Erreur lors de la récupération de l'utilisateur :", err));
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container">
        {/* Titre de l'application qui renvoie à l'accueil */}
        <NavLink className="navbar-brand" to="/">
          Albuminaute
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {/* Liens de navigation */}
            <li className="nav-item">
              <NavLink className="nav-link btn btn-primary" to="/">
                Accueil
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link btn btn-primary" to="/maliste">
                Tous les albums
              </NavLink>
            </li>
            

            {/* 🔥 Bouton Connexion / Profil en fonction de l'état de connexion */}
            <li className="nav-item">
              {user ? (
                <NavLink className="nav-link btn btn-primary" to={`/profil/${user._id}`}>
                Profil ({user.name})
              </NavLink>
              
              ) : (
                <NavLink className="nav-link btn btn-primary" to="/connexion">
                  Connexion
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

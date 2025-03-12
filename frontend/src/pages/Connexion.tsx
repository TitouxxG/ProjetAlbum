import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";


interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
}

const Connexion = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { method: "GET",credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user)); // Sauvegarde locale
          navigate("/"); // Redirection après connexion
        }
      })
      .catch((err) => console.error("Erreur lors de la récupération de l'utilisateur :", err));
  }, );

  const handleLogout = () => {
    fetch("http://localhost:5000/auth/logout", { credentials: "include" }).then(
      () => {
        setUser(null);
        navigate("/");
      }
    );
  };

  return (
    <div>
      <Helmet>
        <title>Page de connexion</title>
      </Helmet>
      <Navbar />
      <div className="connexionConteneur container mt-5">
        <h2 className="text-center">Connexion</h2>
        <div className="card mx-auto p-4  bg-secondary shadow" style={{ maxWidth: "400px" }}>
          {user ? (
            <div className="text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="rounded-circle"
                width="100"
              />
              <h3 className="mt-3">{user.name}</h3>
              <p>{user.email}</p>
              <button className="btn btn-danger w-100" onClick={handleLogout}>
                Se déconnecter
              </button>
            </div>
          ) : (
            <div className="text-center">
              <a
                href="http://localhost:5000/auth/google"
                className="btn btn-outline-primary w-100"
              >
                <span className="material-symbols-outlined">login</span>
                Connexion avec Google
              </a>
            </div>
          )}
          <button
            className="btn btn-secondary w-100 mt-2"
            onClick={() => navigate("/")}
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
      <Footer />

    </div>
    
  );
};

export default Connexion;

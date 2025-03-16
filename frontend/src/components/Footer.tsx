const Footer = () => {
    return (
      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container text-center">
          {/* Section Qui sommes-nous */}
          <p className="mb-2">
            <strong>Albuminaute</strong> est une plateforme dédiée aux passionnés de musique. 
            Découvrez, notez et partagez vos albums préférés avec la communauté !
          </p>
  
          {/* Boutons Retour en haut et Nous contacter */}
          <div className="d-flex justify-content-center gap-3">
            {/* Bouton Retour en haut */}
            <button
              className="btn btn-outline-light"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              ↑ Retour en haut
            </button>
  
            {/* Bouton Nous contacter */}
            <a href="mailto:titouan.grimont@uphf.fr" className="btn btn-outline-light">
              📧 Nous contacter
            </a>
          </div>
  
          {/* Copyright */}
          <p className="mt-3 small">© {new Date().getFullYear()} Albuminaute - Tous droits réservés.</p>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  
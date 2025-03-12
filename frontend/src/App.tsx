import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Connexion from "./pages/Connexion";
import MaListe from "./pages/MaListe";
import Album from "./pages/Album";
import Profil from "./pages/Profil";
import { HelmetProvider } from "react-helmet-async";

import "./styles.css";




function App() {
  return (
    <HelmetProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/maliste" element={<MaListe />}/>
        <Route path="/album/:id" element={<Album />} /> 
        <Route path="/profil/:id" element={<Profil/>}/>
      </Routes>
    </HelmetProvider>
  );
}

export default App;

import albumImage1 from "../img/AlligatorBitesNeverHeal.jpg";
import albumImage2 from "../img/écureuil.png";
import albumImage3 from "../img/pates.jpg";
import albumImage4 from "../img/chien.jpg";
import albumImage5 from "../img/khedma.jpg";
import albumImage6 from "../img/cantrushgreatness.jpg";
import albumImage7 from "../img/DAMN.jpg";
import albumImage8 from "../img/balloonerism.jpg";
import albumImage9 from "../img/GNX.jpg";
import albumImage10 from "../img/CHROMAKOPIA.jpg";

const albums = [
    {
      id: 1,
      title: "Alligator Bites Never Heal",
      artist: "Doechii",
      rating: 91,
      image: albumImage1,
      aEcouter: true,
    },
    {
      id: 2,
      title: "Country Squirrel",
    artist: "CowboyMan",
    rating: 80,
    image: albumImage2,
    aEcouter: true,
  },
  {
    id: 3,
    title: "Tabasse pates",
    artist: "Ouaf Ouaf",
    rating: 85,
    image: albumImage3,
    aEcouter: true,
  },
  {
    id: 4,
    title: "Chien",
    artist: "Chien ",
      rating: 66,
      image: albumImage4,
      aEcouter: false,
    },
    {
      id: 5,
      title: "Khedma",
      artist: "Danyl",
      rating: 74,
      image: albumImage5,
      aEcouter: true,
    },
    {
      id: 6,
      title: "Can't Rush Greatness",
      artist: "Central Cee",
      rating: 89,
      image: albumImage6,
      aEcouter: false,
    },
    {
      id: 7,
      title: "DAMN.",
      artist: "Kendrick Lamar",
      rating: 95,
      image: albumImage7,
      aEcouter: true,
    },
    {
      id: 8,
      title: "Balloonerism",
      artist: "Mac Miller",
      rating: 81,
      image: albumImage8,
      aEcouter: true,
    },
    {
      id: 9,
      title: "GNX",
      artist: "Kendrick Lamar",
      rating: 70,
      image: albumImage9,
      aEcouter: true,
    },
    {
      id: 10,
      title: "CHROMAKOPIA",
      artist: "Tyler, The Creator",
      rating: 88,
      image: albumImage10,
      aEcouter: false,
    },
  ].sort((a, b) => b.rating - a.rating);
  export default albums;
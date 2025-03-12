import mongoose from "mongoose";


const AlbumSchema = new mongoose.Schema({
  id :Number,
  title: String,
  artist: String,
  image: String,
  rating: Number,
  description: String,
  aecouter: Boolean,
  albumId:{ type: mongoose.Schema.Types.ObjectId},
});
const Album = mongoose.model("albums", AlbumSchema);
export default Album; // ✅ `export default`

import { Schema, model } from "mongoose";

const CommentaireSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
  albumId: { type: Schema.Types.ObjectId, ref: "Album", required: true }, // 🔥 Associe chaque commentaire à un album
  content: { type: String, required: true },
  note: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

// Exporte le modèle
export default model("Commentaire", CommentaireSchema);

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Créer un nouvel utilisateur s'il n'existe pas
          user = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
          });
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log("🔄 Désérialisation de l'utilisateur avec ID :", id);
    const user = await User.findById(id);
    if (!user) {
      console.log("⚠️ Utilisateur non trouvé en base de données !");
      return done(null, false);
    }
    console.log("✅ Utilisateur restauré :", user);
    done(null, user);
  } catch (error) {
    console.error("❌ Erreur lors de la désérialisation :", error);
    done(error, null);
  }
});
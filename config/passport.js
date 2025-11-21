const GitHubStrategy = require('passport-github2').Strategy;
const mongodb = require('../data/database');

module.exports = function(passport) {
  passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL
    },
    async function(accessToken, refreshToken, profile, done) {
      try {
        // Check if user exists in database
        const db = mongodb.getDatabase().db();
        let user = await db.collection('users').findOne({ githubId: profile.id });

        if (!user) {
          // Create new user if doesn't exist
          const newUser = {
            githubId: profile.id,
            username: profile.username,
            displayName: profile.displayName,
            profileUrl: profile.profileUrl,
            createdAt: new Date()
          };
          const result = await db.collection('users').insertOne(newUser);
          user = { _id: result.insertedId, ...newUser };
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  ));

  // Serialize user for session
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id, done) => {
    try {
      const ObjectId = require('mongodb').ObjectId;
      const db = mongodb.getDatabase().db();
      const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
};
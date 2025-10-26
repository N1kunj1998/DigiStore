const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// JWT Strategy
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await User.findById(payload.userId);
    if (user) {
      return done(null, user);
    }
    return done(null, false);
  } catch (error) {
    return done(error, false);
  }
}));

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      return done(null, user);
    }
    
    // Create new user
    user = new User({
      googleId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      isActive: true,
      emailVerified: true,
      authProvider: 'google'
    });
    
    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Facebook OAuth Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/api/auth/facebook/callback",
  profileFields: ['id', 'emails', 'name']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists
    let user = await User.findOne({ email: profile.emails[0].value });
    
    if (user) {
      // Update existing user with Facebook info if needed
      if (!user.facebookId) {
        user.facebookId = profile.id;
        await user.save();
      }
      return done(null, user);
    }
    
    // Create new user
    user = new User({
      facebookId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      isActive: true,
      emailVerified: true,
      authProvider: 'facebook'
    });
    
    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Twitter OAuth Strategy
passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "/api/auth/twitter/callback",
  includeEmail: true
}, async (token, tokenSecret, profile, done) => {
  try {
    // Twitter doesn't always provide email, so we'll use username as fallback
    const email = profile.emails ? profile.emails[0].value : `${profile.username}@twitter.com`;
    
    // Check if user already exists
    let user = await User.findOne({ email: email });
    
    if (user) {
      // Update existing user with Twitter info if needed
      if (!user.twitterId) {
        user.twitterId = profile.id;
        await user.save();
      }
      return done(null, user);
    }
    
    // Create new user
    user = new User({
      twitterId: profile.id,
      email: email,
      firstName: profile.displayName.split(' ')[0] || profile.username,
      lastName: profile.displayName.split(' ').slice(1).join(' ') || '',
      isActive: true,
      emailVerified: false, // Twitter email verification is tricky
      authProvider: 'twitter'
    });
    
    await user.save();
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

module.exports = passport;

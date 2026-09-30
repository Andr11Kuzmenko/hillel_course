import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as Account from '../models/accounts.model.js';

/**
 * Local strategy: вхід за email та паролем.
 */
passport.use(
  new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const account = Account.findByEmail(email);
      if (!account) return done(null, false, { message: 'Invalid email or password' });

      const ok = await Account.verifyPassword(account, password);
      if (!ok) return done(null, false, { message: 'Invalid email or password' });

      return done(null, account);
    } catch (err) {
      return done(err);
    }
  }),
);

// У сесію записуємо лише id користувача
passport.serializeUser((account, done) => {
  done(null, account.id);
});

// На кожен запит відновлюємо користувача за id із сесії
passport.deserializeUser((id, done) => {
  try {
    const account = Account.findById(id);
    done(null, account ? Account.toPublic(account) : false);
  } catch (err) {
    done(err);
  }
});

export default passport;

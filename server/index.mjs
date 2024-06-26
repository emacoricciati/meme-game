import express from "express";
import morgan from "morgan";
import cors from "cors";
import { check, param, validationResult } from "express-validator";
import MemeDAO from "./DAO/memeDAO.mjs";
import UserDao from "./DAO/userDAO.mjs";
import GameDAO from "./DAO/gameDAO.mjs";

const memeDAO = new MemeDAO();
const userDao = new UserDao();
const gameDAO = new GameDAO();

/*** init express and set up the middlewares ***/
const app = express();
app.use(morgan("dev"));
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

/*** Passport ***/

/** Authentication-related imports **/
import passport from "passport"; // authentication middleware
import LocalStrategy from "passport-local"; // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUserByCredentials() (i.e., id, username, name).
 **/
passport.use(
  new LocalStrategy(async function verify(username, password, callback) {
    const user = await userDao.getUserByCredentials(username, password);
    if (!user) return callback(null, false, "Incorrect username or password");

    return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUserByCredentials(), i.e, id, username, name)
  })
);

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) {
  // this user is id + username + name
  callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) {
  // this user is id + email + name
  return callback(null, user); // this will be available in req.user

  // In this method, if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
  // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));
});

/** Creating the session */
import session from "express-session";

app.use(
  session({
    secret: "exam-1-emacoricciati",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.authenticate("session"));

/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: "Not authorized" });
};

/*** Utility Functions ***/

// This function is used to handle validation errors
const onValidationErrors = (validationResult, res) => {
  const errors = validationResult.formatWith(errorFormatter);
  return res.status(422).json({ validationErrors: errors.mapped() });
};

// Only keep the error message in the response
const errorFormatter = ({ msg }) => {
  return msg;
};

/*** Users APIs ***/

// POST /api/sessions
// This route is used for performing login.
app.post("/api/sessions", function (req, res, next) {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).json({ error: info });
    }
    // success, perform the login and extablish a login session
    req.login(user, (err) => {
      if (err) return next(err);

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUserByCredentials() in LocalStrategy Verify Function
      return res.json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get("/api/sessions/current", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  } else res.status(401).json({ error: "Not authenticated" });
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete("/api/sessions/current", (req, res) => {
  req.logout(() => {
    res.end();
  });
});

// /*** Meme APIs ***/

// 1. Get a random meme
// GET /api/memes/random
// This route returns a meme object with all possible captions to play
app.get("/api/memes/random", (req, res) => {
  const excludedIds = req.query.ids;
  // get films that match optional filter in the query
  memeDAO.getRandomImage(excludedIds).then((image) => res.json(image)).catch((err) => res.status(500).json(err));
});


// /*** Game APIs ***/

// 1. Post a game result
// POST /api/games
// This route is used to post a game result
const gameValidation = [
  check("total").isInt({ min: 0 }),
  check("date").isISO8601().toDate(),
  check("time_taken").isInt({ min: 0 }),
  check("rounds").isArray({ min: 1 }),
]
app.post("/api/games", isLoggedIn, gameValidation, (req, res) => {
  const invalidFields = validationResult(req);
  if (!invalidFields.isEmpty()) {
    return onValidationErrors(invalidFields, res);
  }
  const userId = req.user.id;
  const { total, date, time_taken, rounds } = req.body;
  gameDAO.saveGame(userId, total, date, time_taken ,rounds).then(() => res.status(200).end()).catch((err) => res.status(500).json(err));
});

// 2. Get all past games for an user
// GET /api/games
// This route is used to get all past games for an user
app.get("/api/games", isLoggedIn, (req, res) => {
  const userId = req.user.id;
  gameDAO.getAllGames(userId).then((games) => res.json(games)).catch((err) => res.status(500).json(err));
});

// 3. Get a specific game for an user
// GET /api/games/:id
// This route is used to get all past games for an user
app.get("/api/games/:id", isLoggedIn, (req, res) => {
  const userId = req.user.id;
  const gameId = req.params.id;
  gameDAO.getGame(userId,gameId).then((games) => res.json(games)).catch((err) => res.status(500).json(err));
});

// 4. Get total points for an user
// GET /api/games/total
// This route is used to get total points for an user
app.get("/api/user/points", (req, res) => {
  const userId = req.user.id;
  gameDAO.getTotalPoints(userId).then((points) => res.json(points)).catch((err) => res.status(500).json(err));
});

// 5. Get unlocked memes for an user
// GET /api/user/memes/unlocked
// This route is used to get unlocked images for an user
app.get("/api/user/memes/unlocked", isLoggedIn, (req, res) => {
  const userId = req.user.id;
  gameDAO.getUnlockedMemes(userId).then((images) => res.json(images)).catch((err) => res.status(500).json(err));
});

// 6. Get correct captions for a specific meme
// GET /api/memes/:id/captions
// This route is used to get correct captions for a specific meme
app.get("/api/memes/:id/captions", (req, res) => {
  const imageId = req.params.id;
  memeDAO.getCaptionsByImageId(imageId).then((captions) => res.json(captions)).catch((err) => res.status(500).json(err));
});

// 7. Validate the meme caption answer
// GET /api/memes/:id/validate/:captionId
// This route is used to validate the meme caption answer
app.get("/api/memes/:id/validate/:captionId", (req, res) => {
  const imageId = req.params.id;
  const captionId = req.params.captionId;
  memeDAO.validateAnswer(imageId, captionId).then((result) => res.json(result)).catch((err) => res.status(500).json(err));
});

// Activating the server
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}/`)
);
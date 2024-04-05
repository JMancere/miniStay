const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const { restoreUser } = require("../../utils/auth.js");

const spotsRouter = require('./spots.js');
const bookingsRouter = require('./bookings.js');
const reviewRouter = require('./reviews.js');
const reviewImagesRouter = require('./review-images.js');
const spotImagesRouter = require('./spot-images.js');

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);


router.use('/session', sessionRouter);

router.use('/users', usersRouter);

router.use('/bookings', bookingsRouter);
router.use('/spots', spotsRouter);
router.use('/reviews', reviewRouter);
router.use('/review-images', reviewImagesRouter);
router.use('/spot-images', spotImagesRouter);

//Was used before frontend was added.
// router.post('/test', (req, res) => {
//   res.json({ requestBody: req.body });
// });

module.exports = router;

//original verification testing follows. Ok to remove.

// router.post('/test', function(req, res) {
//     res.json({ requestBody: req.body });
//   });

//   // GET /api/restore-user
// const { restoreUser } = require('../../utils/auth.js');

// router.use(restoreUser);

// // GET /api/require-auth
// router.get(
//   '/require-auth',
//   requireAuth,
//   (req, res) => {
//     return res.json(req.user);
//   }
// );



// router.get(
//   '/restore-user',
//   (req, res) => {
//     return res.json(req.user);
//   }
// );

// // GET /api/set-token-cookie
// const { setTokenCookie } = require('../../utils/auth.js');
// const { User } = require('../../db/models');
// router.get('/set-token-cookie', async (_req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: 'Demo-lition'
//     }
//   });
//   setTokenCookie(res, user);
//   return res.json({ user: user });
// });

import express from 'express';

import { getAllArtists, getArtistsByCountry, getArtistProfile } 
  from '../controllers/artistsController.js';


const router = express.Router();


/**
 * @swagger
 * /api/artists:
 *   get:
 *     summary: Gets all artists
 *     description: Retrieves all artists from the database.
 *     responses:
 *       200:
 *         description: A list of all artists.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The artist's unique identifier.
 *                     example: 672e62020ea130bec7a9d050
 *                   name:
 *                     type: string
 *                     description: The artist's name.
 *                     example: drake
 *                   country:
 *                     type: string
 *                     description: The country they are from.
 *                     example: canada
 *       404:
 *         description: No artists found in the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   example: cannot find artist(s)
 *       500:
 *         description: Server error while fetching artists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: Server error while fetching artists
 */
router.get('/artists', getAllArtists);


router.param('country', function(req, res, next, country) {
  const modified = country.toLowerCase();
  req.country = modified;
  next();
});
  
/**
   * @swagger
   * /api/country/{country}:
   *   get:
   *     summary: gets the list of artists from a country
   *     description: gets a list of artists from a country 
   *      which could then be used to fetch for their songs
   *     parameters:
   *       - in: path
   *         name: country
   *         required: true
   *         description: Country to get artist from.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: A list of artists.
   *         content:
   *           application/json:
   *             schema:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       _id:
   *                         type: string
   *                         description: The id to store in database.
   *                         example: 672e62020ea130bec7a9d050
   *                       name:
   *                         type: string
   *                         description: The artist's name.
   *                         example: drake
   *                       country:
   *                         type: string
   *                         description: The country they are from.
   *                         example: canada
   *       404:
   *         description: No artists found in the specified country.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 404
   *                 message:
   *                   type: string
   *                   example: cannot find artist(s)
   *       500:
   *        description: Server error while fetching artists.
   *        content:
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status:
   *                  type: integer
   *                  example: 500
   *                message:
   *                  type: string
   *                  example: Server error while fetching artists
  */
router.get('/country/:country', getArtistsByCountry);


router.param('artist', function(req, res, next, artist){
  req.artist = artist;
  next();
});
  
/**
   * @swagger
   * /api/artist/{artist}:
   *   get:
   *     summary: gets an artist object
   *     description: gets an artist object with all their songs
   *     parameters:
   *       - in: path
   *         name: artist
   *         required: true
   *         description: name of artist to get.
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: An artist.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                       artist:
   *                         type: string
   *                         description: The name of the artist.
   *                         example: drake
   *                       country:
   *                         type: string
   *                         description: The country they are from.
   *                         example: canada
   *                       songs:
   *                         type: array
   *                         description: the artist of the song.
   *                         example: ["family matters, Spotify Streams: 72335127", 
   *                          "rich baby daddy (feat. sexyy red & sza), Spotify Streams: 372248119"]
   *       404:
   *        description: Artist not found.
   *        content: 
   *          application/json:
   *            schema:
   *              type: object
   *              properties:
   *                status: 
   *                  type: integer
   *                  example: 404
   *                message:
   *                  type: string
   *                  example: cannot find artist
   *       500:
   *         description: Server error while fetching artist data.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 status:
   *                   type: integer
   *                   example: 500
   *                 message:
   *                   type: string
   *                   example: Server error while fetching artist
  */
router.get('/artist/:artist', getArtistProfile);
  
export default router;
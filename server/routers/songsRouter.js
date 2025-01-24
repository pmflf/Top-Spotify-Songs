import express from 'express';

import { getSong, readTopSongs, getSongsByName } from '../controllers/songsController.js';


const router = express.Router();


router.param('song', function(req, res, next, song) {
  const modified = song.toLowerCase();
  req.song = modified;
  next();
});


/**
 * @swagger
 * /api/song/{song}:
 *   get:
 *     summary: gets a song object
 *     description: gets a song object
 *     parameters:
 *       - in: path
 *         name: song
 *         required: true
 *         description: name of song to get.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A single song.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                       _id:
 *                         type: string
 *                         description: The id to store in database.
 *                         example: 672e62020ea130bec7a9d050
 *                       song:
 *                         type: string
 *                         description: The song's name.
 *                         example: million dollar baby
 *                       artist:
 *                         type: string
 *                         description: the artist of the song.
 *                         example: ava max
 *       404:
 *         description: Song not found.
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
 *                   example: cannot find such song
 *       500:
 *         description: Server error while fetching song.
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
 *                   example: Server error while fetching song 
*/
router.get('/song/:song', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
}, getSong);


/**
 * @swagger
 * /api/songs/top50:
 *   get:
 *     summary: gets top 50 songs
 *     description: gets the top 50 songs of 2024 which is used to be displayed in the web app
 *     responses:
 *       200:
 *         description: A list of 50 songs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The id to store in database.
 *                         example: 672e62020ea130bec7a9d050
 *                       song:
 *                         type: string
 *                         description: The song's name.
 *                         example: million dollar baby
 *                       artist:
 *                         type: string
 *                         description: the artist of the song.
 *                         example: ava max
 *                       spotifyStreams:
 *                         type: int
 *                         description: how many streams the song has
 *                         example: 1234012035
 *       500:
 *        description: Server error while fetching top 50 songs.
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
 *                  example: Server error while fetching songs
*/
router.get('/songs/top50', (req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
}, readTopSongs);


/**
 * @swagger
 * /api/songs/name/{name}:
 *   get:
 *     summary: Fetches songs by name
 *     description: Returns up to 20 songs whose name contains the provided `name` parameter
 *      (case-insensitive).
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: The song name to search for.
 *     responses:
 *       200:
 *         description: A list of songs matching the name.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The song's unique identifier.
 *                     example: 672e62020ea130bec7a9d050
 *                   song:
 *                     type: string
 *                     description: The name of the song.
 *                     example: million dollar baby
 *                   artist:
 *                     type: string
 *                     description: The artist of the song.
 *                     example: ava max
 *                   spotifyStreams:
 *                     type: integer
 *                     description: The number of streams for the song.
 *                     example: 1234012035
 *       404:
 *         description: No songs found with the specified name.
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
 *                   example: Cannot find such song
 *       500:
 *         description: Server error while fetching songs.
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
 *                   example: Server error while fetching song 
 */
router.get('/songs/name/:name', getSongsByName);
  

export default router;
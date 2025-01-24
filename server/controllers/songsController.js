import { db } from '../db/db.js';


/**
 * Fetches all the songs from the database
 * @param {Object} req - The request object.
 * @param {string} req.song - the song name to get from the database
 * @param {response} res - the result is the songs information or error message
 */
async function getSong(req, res) {
  const song = req.song;
  try {
    const data = await db.getSong(song);
    if (data.length === 0) {
      res.status(404).json({status: 404, message: 'cannot find such song'});
    }else {
      res.set('Cache-Control', 'no-cache, max-age=3600');
      res.json(data);
    }
  } catch(e) {
    console.error('Erorr while fetching song ' + e);
    res.status(500).json({status: 500, message: 'Server error while fetching song'});
  }
}


/**
 * Fetches the top 50 songs from the database
 * @param {Object} req - The request object.
 * @param {request} req - None
 * @param {response} res - Results is the top 50 songs returned or error message.
 */
async function readTopSongs(req, res) {
  try {
    const topSongs = await db.getTopSongs();
    if (!topSongs || topSongs.length === 0) {
      return res.status(500).json({
        status: 500,
        message: 'Server error while fetching songs'
      });
    }
    res.set('Cache-Control', 'no-cache, max-age=3600');
    res.json(topSongs);
  } catch (e) {
    console.error('Error fetching top 50 songs:', e.message);
    res.status(500).json({ status: 500, message: 'Server error while fetching songs' });
  }
}


/**
 * Fetches songs from the database whose name contains the provided song name.
 * @param {Object} req - The request object.
 * @param {string} req.params.name - The name to be queried for 
 * @param {Object} res - Result is the all the songs correlated to that name or error message.
 */
async function getSongsByName(req, res){
  const songName = req.params.name;
  try {
    const data = await db.getSongsByName(songName);
  
    if (data.length === 0) {
      res.status(404).json({ status: 404, message: 'Cannot find such song' });
    } else {
      res.set('Cache-Control', 'no-cache, max-age=3600');
      res.json(data);
    }
  } catch (e) {
    console.error('Error while fetching song: ', e.message);
    res.status(500).json({ status: 500, message: 'Server error while fetching song' });
  }
}


export {getSong, getSongsByName, readTopSongs};
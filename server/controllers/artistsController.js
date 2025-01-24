import { db } from '../db/db.js';


/**
 * Fetches all artists from the database.
 * @param {Object} req - The request object.
 * @param {object} req - None
 * @param {object} res - The result is all the artist from the database or error message
 * 
 */
async function getAllArtists(req, res){
  try{
    const artists = await db.getAllArtists();
    if (artists.length === 0) {
      res.status(404).json({status: 404, message: 'cannot find artist(s)'});
    }else {
      res.set('Cache-Control', 'no-cache, max-age=3600');
      res.json(artists);
    }
  } catch(error) {
    console.error('Error fetching artists:', error);
    res.status(500).json({status: 500, message: 'Server error while fetching artists' });
  } 
}


/**
 * gets a parameter country that is req and fetches artists from that country from the database
 * @param {Object} req - The request object.
 * @param {string} req.country - The country name that will be used to find the artists
 * @param {response} res - Result is all the artists from that country
 */
async function getArtistsByCountry(req, res) {
  const country = req.country;
  try{
    const artists = await db.getArtistFromCountry(country);
    if (artists.length === 0) {
      res.status(404).json({status: 404, message: 'cannot find artist(s)'});
    }else {
      res.set('Cache-Control', 'no-cache, max-age=3600');
      res.json(artists);
    }
  }catch (error) {
    console.error('Error fetching artists by country:', error);
    res.status(500).json({status: 500, message: 'Server error while fetching artists' });
  }
}


/**
 * Fetches the profile of a specific artist based on their name.
 * @param {Object} req - The request object.
 * @param {string} req - the name of the artist
 * @param {object} res.params.artist - Result is the artist informationor error message.
 * 
 */
async function getArtistProfile(req, res){
  const artistName = decodeURIComponent(req.params.artist);
  try{
    //this is to make querying with $ work...
    const escapedArtistName = artistName.replace(/\$/g, '\\$');
    const data = await db.getArtist(escapedArtistName);
    if(data.length === 0){
      res.status(404).json({status: 404, message: 'cannot find artist'});
    }else {
      res.set('Cache-Control', 'no-cache, max-age=3600');
      res.json(data);
    }
  } catch(e){
    console.error('Error while fetching artist: ' + e.message);
    res.status(500).json({status: 500, message: 'Server error while fetching artist'});
  }
}

export {getAllArtists, getArtistsByCountry, getArtistProfile};
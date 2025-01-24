import read from './readFile.js';
import { db } from '../db/db.js';



/**
 * Fetches artist data from a CSV file and song data from the database, 
 * filters artists that have songs, and stores the unique artists in the database.
 * 
 * @returns {Promise<void>} - A promise that resolves when artists are stored in the database.
 */
async function getArtists() {
  const data = await Promise.all([
    await read('./datasets/artists.csv'),
    await db.readAll('songs')
  ]);
  const allArtists = data[0];
  const songs = data[1];
  const artists = [];
  for (var i = 1; i < allArtists.length; i++) {
    const separated = allArtists[i].split(',');
    // NOTE check if the name and country field is not empty
    if (separated[1] && separated[3]) {
      // NOTE check if the artist has a song
      if (songs.some(song => song.artist && 
        song.artist.toLowerCase() === separated[1].toLowerCase())) {
      // check if they have already been added
        const artistToInsert = {
          name: separated[1].toLowerCase(), 
          country: separated[3].toLowerCase() 
        };
        if (!artists.some(artist => artist.name === artistToInsert.name)) {
          artists.push(artistToInsert);
        }
      }
      
    } 
  }
  return db.createMany(artists, 'artists');
}

/**
 * uses the read method to from readFile.js to read a csv and parse
 * it into an list of objects
 * @returns a list of objects
 */
async function getSongs() {
  const allSongs = await read('./datasets/songs_cut.csv');
  const songs =  sortSongs(allSongs);
  return db.createMany(songs, 'songs');
}


/**
 * drops the song collection and changes it to a filtered list instead
 */
async function updateSongsWithArtist(){
  const data = await Promise.all([
    await db.readAll('songs'),
    await db.readAll('artists')
  ]);
  const songs = data[0];
  const artists = data[1];
  const filteredSongs = songs.filter(song => {
    const artist = artists.find(a => a.name.toLowerCase() === song.artist.toLowerCase());
    return artist;
  });

  if (filteredSongs.length > 0) {
    await db.dropCollection('songs');
    await db.createMany(filteredSongs, 'songs');  
  }
}


/**
 * Processes an array of song data, extracting song name, artist, and Spotify streams, 
 * and returns an array of unique songs.
 * 
 * @param {string[]} allSongs - Array of song data in CSV format.
 * @returns {Object[]} - Array of unique song objects with `song`,
 *  `artist`, and `spotifyStreams` properties.
 */
function sortSongs(allSongs){
  const results = [];
  // NOTE start at 1 because the first entry is the header rows
  // ends before 1 because last entry is empty
  for (let i = 1; i < allSongs.length - 1; i++){
    // NOTE seperate the song string at "," except when surrounded by " "
    // then add song name, artist, and spotify streams, alblum name, release date
    const seperated = allSongs[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    const spotifyStreams = parseInt(seperated[4].replace(/,|"/g, ''));
    // check if song have already been added
    const songToInsert = {
      song: seperated[0].toLowerCase(), 
      artist: seperated[2].toLowerCase(),
      spotifyStreams: spotifyStreams 
    };
    if (!results.some(song => song.song === songToInsert.song)) {
      results.push(songToInsert);
    }
  }

  return results;
}

/**
 * Fetches country data from a CSV file and artist data from the database,
 * sorts the countries based on whether they have associated artists, and
 * stores the sorted countries in the database.
 * 
 * @returns {Promise<void>} - A promise that resolves when the sorted countries 
 * are successfully stored in the database.
 * 
 * @throws {Error} - Throws an error if there is an issue reading the country data 
 * or artist data, or if there is an issue saving the sorted countries.
 */
async function getCountries() {
  const data = await Promise.all([
    await read('./datasets/countries.csv'),
    await db.readAll('artists')
  ]);
  const allCountries = data[0];
  const artists = data[1];
  const sortedCountries = sortCountries(allCountries, artists);
  return db.createMany(sortedCountries, 'countries');
}

/**
 * Filters and returns countries that have artists from the provided list.
 * Each country in the result contains its name and coordinates.
 * 
 * @param {string[]} allCountries - Array of country data strings in the format 
 * `name,latitude,longitude`.
 * @param {Object[]} artists - Array of artist objects, each with a `country` property.
 * 
 * @returns {Object[]} - Array of country objects, each with a `name` (country name)
 *  and `coordinates` (latitude, longitude).
 */
function sortCountries(allCountries, artists){
  const results = [];
  for (let i = 1; i < allCountries.length; i++){
    const separated = allCountries[i].split(',');
    const latitude = parseFloat(separated[5]);
    const longitude = parseFloat(separated[6]);
    const countryName = separated[0].toLowerCase();

    // Check if any artist's country matches the current country
    const countryHasArtist = artists.some(artist => artist.country === countryName);

    // Only add the country if there's at least one artist from that country
    if (countryHasArtist) {
      results.push({
        'name': countryName,
        'coordinates': [longitude, latitude]
      });
    }
  }
  return results;
}

export {getArtists, getCountries, getSongs, sortSongs, sortCountries, updateSongsWithArtist};

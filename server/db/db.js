import 'dotenv/config';
import { MongoClient } from 'mongodb';
const dbUrl = process.env.ATLAS_URI;
import cache from 'memory-cache';

let instance = null;
const cacheDuration = 5 * 60 * 1000;
class DB {
  constructor(){
    //instance is the singleton, defined in outer scope
    if (!instance){
      instance = this;
      this.mongoClient = null;
      this.db = null;
    }
    return instance;
  }

  async connect(dbname){
    if (!this.mongoClient) {
      this.mongoClient = new MongoClient(dbUrl);

      if (instance.db){
        return;
      }
      await instance.mongoClient.connect();
      instance.db = await instance.mongoClient.db(dbname);
      console.log('Successfully connected to MongoDB database ' + dbname);
    }
  }
  
  /**
   * should delete  the collection
   * @async
   * @function
   * @returns {Promise<Object[]>} - A promise that resolves to objects dropped
   */
  async dropCollection(collection) {
    return await instance.db.collection(collection).drop();
  }

  async close() {
    await this.mongoClient.close();
    instance = null;
  }

  /**
   * should return all the artists
   * @async
   * @function
   * @returns {Promise<Object[]>} - A promise that resolves to artist's objects.
   */
  async getAllArtists() {
    const cachedArtists = cache.get('allArtists');
    if (cachedArtists) {
      console.log('Retrieved all artists from cache');
      return cachedArtists;
    }
  
    const artists = await instance.db.collection('artists').
      find({}, { projection: { name: 1, _id: 0 } }).toArray();
  
    const artistNames = artists.map(artist => artist.name); 
    cache.put('allArtists', artistNames, cacheDuration);
    
    return artistNames;
  }

  /**
   * should return all country 
   * @async
   * @function
   * @returns {Promise<Object[]>} - A promise that resolves to countries objects.
   */
  async getAllCountries() {
    const cachedCountries = cache.get('countries');
    if(cachedCountries){
      console.log(`retrieve from all countries from cache `);

      return cachedCountries;
    }
    const countries = await instance.db.collection('countries').find().toArray();
    cache.put('countries', countries, cacheDuration );
    return countries;
  }

  /**
   * should return all songs from an artist and country they are from
   * @async
   * @function
   * @param {string} artistName - the name of the artist to be queried for.
   * @returns {Promise<Object[]>} - A promise that resolves to artist's info objects.
   */
  async getArtist(artistName) {
    const cachedArtist = cache.get(artistName);
    if(cachedArtist){
      console.log(`retrieve from ${artistName} from cache `);

      return cachedArtist;
    }
    const artist = await instance.db.collection('artists').findOne({
      'name': { $regex: new RegExp(`^${artistName}$`, 'i') }
    });
    const songs = await instance.db.collection('songs').find({
      'artist': { $regex: new RegExp(`^${artistName}$`, 'i') }
    }).toArray();

    const artistWithSongs =  {
      artist: artist.name,
      country: artist.country,
      songs: songs.map(song => ({
        name: song.song,
        spotifyStreams: song.spotifyStreams
      }))
    };
    cache.put(artistName, artistWithSongs, cacheDuration);
    return artistWithSongs;

  }

  /**
   * should return informtation about a single song
   * @async
   * @function
   * @param {string} songName - the name of the song to be querried for.
   */
  async getSong(songName) {
    const cacheSong = cache.get(songName);
    if(cacheSong){
      console.log(`retrieve from ${songName} from cache `);

      return cacheSong;
    }
    const song =  await instance.db.collection('songs').
      find({ 'song': { $eq: songName} }).toArray();
    cache.put(songName, song, cacheDuration);
    return song;
  }

  /**
   * should return all artist's from a country they are from.
   * @async
   * @function
   * @param {string} country - the name of the country to filter with
   * @returns {Promise<Object[]>} - A promise that resolves to artist's info objects.
   */
  async getArtistFromCountry(country) {
    const cachedArtistFromCountry = cache.get(country);
    if(cachedArtistFromCountry){
      console.log(`Retrieved artist from ${country} from cache`);
      return cachedArtistFromCountry;
    }
    const artists = await instance.db.collection('artists').find({ country: country }).toArray();
    cache.put(country, artists, cacheDuration);
    return artists;
  }

  /**
 * Fetches the first 20 songs from the database whose name contains the provided `name` parameter.
 * @async
 * @function
 * @param {string} name - The song name to be filtered with (case-insensitive).
 * @returns {Promise<Object[]>} - A promise that resolves to an array of song objects.
 */
  async getSongsByName(name) {
    name = String(name).trim(); 
    const cacheSongsbyName = cache.get(name);
    if(cacheSongsbyName){
      console.log(`retrieve from ${name} from cache `);
      return cacheSongsbyName;
    }
    const regex = new RegExp(name, 'i');
    const songs = await this.db.collection('songs').
      find({ 'song': { $regex: regex } }).
      limit(20).
      toArray();
    cache.put(name, songs, cacheDuration );
    return songs;
  }




  /**
   * Retrieves the top 50 songs sorted by Spotify streams in descending order.
   * @async
   * @function
   * @returns {Promise<Object[]>} - A promise that resolves to an array of the top 50 songs,
   */
  async getTopSongs(){
    const cacheSongs = cache.get('topSongs');
    if(cacheSongs){
      console.log(`retrieve from top50SONGS from cache `);

      return cacheSongs;
    }
    const topSongs = await instance.db.collection('songs').
      find().
      sort({'spotifyStreams': -1 }).
      limit(50).
      toArray();
    cache.put('topSongs', topSongs, cacheDuration);
    return topSongs;
  }
  /**
   * read from a collection
   * @async
   * @function
   * @param {string} collection - name of the collection to be read.
   * @returns {Promise<Object[]>} all the items from that
   */
  async readAll(collection) {
    return await instance.db.collection(collection).find().toArray();
  }
  /**
   * create a item from a collection
   * @async
   * @function
   * @param {object} item - object to be added
   * @param {string} collection - name of the collection to be added to.
   * @returns {Promise<Object[]>} a creation of a item from the database
   */
  async create(item, collection) {
    return await instance.db.collection(collection).insertOne(item);
  }
  /**
   * open a connection to db
   * @async
   * @function
   * @param {string} dbname - name to connect to.
   * @returns void
   */
  async open(dbname) {
    try {
      await this.connect(dbname);
      // Perform operations here instead of closing immediately
    } finally {
      // Comment out the close here to keep the connection open for further operations
      // await this.close();
    }
  }
  /**
   * create items from a collection
   * @async
   * @function
   * @param {object} items - objects to be added
   * @param {string} collection - name of the collection to be added to.
   * @returns  {Promise<Object[]>} a creation of a item from the database
   */
  async createMany(items, collection) {
    return await instance.db.collection(collection).insertMany(items);
  }

  /**
   * give the count back for that collection
   * @async
   * @function
   * @param {string} collection - name of the collection to be check with.
   * @returns {Promise<Object[]>} the collection's count 
   */
  async countItemInCollection(collection) {
    return await instance.db.collection(collection).count();
  }
}

export const db = new DB();
import { db } from '../db/db.js';
import { getCountries, getSongs, getArtists, updateSongsWithArtist } from './seed.js';

try {
  await db.connect('520Prod');
  Promise.all([
    await db.dropCollection('songs'),
    await db.dropCollection('artists'),
    await db.dropCollection('countries')
  ]);

  // NOTE need songs to be seeded first
  await getSongs();
  await Promise.all([
    await getArtists(),
    await getCountries(),
    await updateSongsWithArtist()
  ]);
  
} catch (e) {
  console.error('could not seed');
  console.dir(e);
} finally {
  if (db) {
    db.close();
  }
  process.exit();
}

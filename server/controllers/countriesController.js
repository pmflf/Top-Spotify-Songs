import { db } from '../db/db.js';


/**
 * Fetches all countries that are in the database
 * @param {Object} req - The request object.
 * @param {request} req - None
 * @param {response} res - Results are all the countries returned or error message
 */
async function getAllCountries(req, res) {
  try {
    const allCountries = await db.getAllCountries();
    if (allCountries.length === 0) {
      res.status(500).json({ status: 500, message: 'There was no data in database' });
    } else {
      res.set('Cache-Control', 'no-cache, max-age=3600');
      res.json(allCountries);
    }
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({ status: 500, message: 'Server error while fetching countries' });
  }
}

export { getAllCountries };
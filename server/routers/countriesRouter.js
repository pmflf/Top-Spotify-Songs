import express from 'express';

import { getAllCountries } from '../controllers/countriesController.js';

const router = express.Router();

/**
 * @swagger
 * /api/country:
 *   get:
 *     summary: Get a list of all countries
 *     description: Fetches all countries within the db, containing id, name and
 *      coordinates to be used to display on the map.
 *     responses:
 *       200:
 *         description: A list of country objects.
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
 *                       name:
 *                         type: string
 *                         description: The country's name.
 *                         example: argentina
 *                       coordinates:
 *                         type: array
 *                         description: longitude and latitude of country.
 *                         example: [-63.616672, -38.416097]
 *       500:
 *         description: Server error while fetching countries.
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
 *                   example: Server error while fetching countries
 */
router.get('/country', getAllCountries);

export default router;
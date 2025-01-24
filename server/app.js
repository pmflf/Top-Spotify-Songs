import express from 'express';
import artistsRouter from './routers/artistsRouter.js';
import songsRouter from './routers/songsRouter.js';
import countriesRouter from './routers/countriesRouter.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import compression from 'compression';
import etag from 'etag';
// app.js

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for Top Spotify Songs 2024',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

app.set( etag, 'strong');

app.use(compression());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.static('../client/dist', { 
  etag: true,
  lastModified: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'no-cache, max-age=31536000');
  }
}));

app.use('/api', artistsRouter);

app.use('/api', songsRouter);

app.use('/api', countriesRouter);

app.use(function (req, res) {
  res.status(404).json({error: 'not supported route'});
});

export default app;
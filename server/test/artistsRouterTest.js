import express from 'express';
import request from 'supertest';
import * as chai from 'chai';
import router from '../routers/artistsRouter.js';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { db } from '../db/db.js';

const stubDbGetArtist = sinon.stub(db, 'getArtist');
const stubDbGetArtistFromCountry = sinon.stub(db, 'getArtistFromCountry');
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('api/artist/', () => {
  let app;
  
  before(() => {
    // express instance stub
    // needed for supertest
    app = express();
    app.use('/api', router);
  });
  
  after(() => {
    stubDbGetArtist.restore();
  });

  it('should test artist api endpoint and return songs with matching name', async () => {
    stubDbGetArtist.resolves([{
      artist: 'Coldplay',
      country: 'United Kingdom',
      songs: [
        'My Universe, Spotify Streams: 1269607301',
        'Hymn For The Weekend - Seeb Remix, Spotify Streams: 652636187',
        'Adventure Of A Lifetime, Spotify Streams: 1020239582',
        'Higher Power, Spotify Streams: 349603788',
        'Viva La Vida, Spotify Streams: 2102223775',
        'Paradise, Spotify Streams: 1291954163',
        'A Sky Full of Stars, Spotify Streams: 1490987063',
        'My Universe, Spotify Streams: NaN',
        'Paradise - Radio Edit, Spotify Streams: 1287292679',
        'The Scientist, Spotify Streams: 1903413912'
      ]
    }]);
    
    const response = await request(app).get('/api/artist/Coldplay');
    expect(response.body).to.deep.equal(
      [{
        artist: 'Coldplay',
        country: 'United Kingdom',
        songs: [
          'My Universe, Spotify Streams: 1269607301',
          'Hymn For The Weekend - Seeb Remix, Spotify Streams: 652636187',
          'Adventure Of A Lifetime, Spotify Streams: 1020239582',
          'Higher Power, Spotify Streams: 349603788',
          'Viva La Vida, Spotify Streams: 2102223775',
          'Paradise, Spotify Streams: 1291954163',
          'A Sky Full of Stars, Spotify Streams: 1490987063',
          'My Universe, Spotify Streams: NaN',
          'Paradise - Radio Edit, Spotify Streams: 1287292679',
          'The Scientist, Spotify Streams: 1903413912'
        ]
      }]
    );
  });
    
  it('should test artist api endpoint and return 200 status code', async () => {
    stubDbGetArtist.resolves([{
      artist: 'Coldplay',
      country: 'United Kingdom',
      songs: [
        'My Universe, Spotify Streams: 1269607301',
        'Hymn For The Weekend - Seeb Remix, Spotify Streams: 652636187',
        'Adventure Of A Lifetime, Spotify Streams: 1020239582',
        'Higher Power, Spotify Streams: 349603788',
        'Viva La Vida, Spotify Streams: 2102223775',
        'Paradise, Spotify Streams: 1291954163',
        'A Sky Full of Stars, Spotify Streams: 1490987063',
        'My Universe, Spotify Streams: NaN',
        'Paradise - Radio Edit, Spotify Streams: 1287292679',
        'The Scientist, Spotify Streams: 1903413912'
      ]
    }]);
    
    const response = await request(app).get('/api/artist/Coldplay');
    expect(response.statusCode).to.equal(200);
  });
      
  it('should test artist api endpoint and returns and error', async () => {
    stubDbGetArtist.resolves([]);
    
    const response = await request(app).get('/api/artist/Coldplay');
    expect(response.status).to.equal(404);
    expect(response.body).to.deep.equal(
      {
        'status': 404,
        'message': 'cannot find artist'
      }
    );
  });
    
});

describe('api/country/', () => {
  let app;
  
  before(() => {
    // express instance stub
    // needed for supertest
    app = express();
    app.use('/api', router);
  });
  
  after(() => {
    stubDbGetArtistFromCountry.restore();
  });
  
  it('should test country api endpoint and return artists who are from that country', async () => {
    stubDbGetArtistFromCountry.resolves([{
      '_id': '671ffb3663e6b458c254b376',
      'name': 'grandson',
      'country': 'Canada'
    }]);
  
    const response = await request(app).get('/api/country/Canada');
    expect(response.body).to.deep.equal(
      [{
        '_id': '671ffb3663e6b458c254b376',
        'name': 'grandson',
        'country': 'Canada'
      }]
    );
  });
  
  it('should test country api endpoint and return 200 respond code', async () => {
    stubDbGetArtistFromCountry.resolves([{
      '_id': '671ffb3663e6b458c254b376',
      'name': 'grandson',
      'country': 'Canada'
    }]);
  
    const response = await request(app).get('/api/country/Canada');
    expect(response.statusCode).to.equal(200);
  });
  
    
  it('should test country api endpoint and returns and error', async () => {
    stubDbGetArtistFromCountry.resolves([]);
  
    const response = await request(app).get('/api/country/Canada');
    expect(response.body).to.deep.equal(
      {
        'status': 404,
        'message': 'cannot find artist(s)'
      }
    );
  });
  
  it('should test country api endpoint with status code 404', async () => {
    stubDbGetArtistFromCountry.resolves([]);
  
    const response = await request(app).get('/api/country/Canada');
    expect(response.statusCode).to.equal(404);
  });
  
});
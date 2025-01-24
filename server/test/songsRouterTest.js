import express from 'express';
import request from 'supertest';
import * as chai from 'chai';
import router from '../routers/songsRouter.js';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { db } from '../db/db.js';

const stubDbGetSong = sinon.stub(db, 'getSong');
const stubDbGetTopSong = sinon.stub(db, 'getTopSongs');
const stubDbGetSongsByName = sinon.stub(db, 'getSongsByName');
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('api/song/', () => {
  let app;
  
  before(() => {
    // express instance stub
    // needed for supertest
    app = express();
    app.use('/api', router);
  });
  
  after(() => {
    stubDbGetSong.restore();
  });
  
  it('should test song api endpoint and return songs with matching name', async () => {
    stubDbGetSong.resolves([{
      '_id': '671eade99f8bcdc26c684156',
      'song': 'million dollar baby',
      'artist': 'tommy richman',
      'spotify_streams': 390470936
    }]);
  
    const response = await request(app).get('/api/song/million dollar baby');
    expect(response.body).to.deep.equal(
      [{
        '_id': '671eade99f8bcdc26c684156',
        'song': 'million dollar baby',
        'artist': 'tommy richman',
        'spotify_streams': 390470936
      }]
    );
  });
  
  it('should test song api endpoint and return 200 respond code', async () => {
    stubDbGetSong.resolves([{
      '_id': '671eade99f8bcdc26c684156',
      'song': 'million dollar baby',
      'artist': 'tommy richman',
      'spotify_streams': 390470936
    }]);
  
    const response = await request(app).get('/api/song/million dollar baby');
    expect(response.statusCode).to.equal(200);
  });
  
    
  it('should test song api endpoint and returns and error', async () => {
    stubDbGetSong.resolves([]);
  
    const response = await request(app).get('/api/song/million dollar baby');
    expect(response.body).to.deep.equal(
      {
        'status': 404,
        'message': 'cannot find such song'
      }
    );
  });
  
  it('should test song api endpoint with status code 404', async () => {
    stubDbGetSong.resolves([]);
  
    const response = await request(app).get('/api/song/million dollar baby');
    expect(response.statusCode).to.equal(404);
  });
});
  
describe('api/songs/', () => {
  let app;
  
  before(() => {
    // express instance stub
    // needed for supertest
    app = express();
    app.use('/api', router);
  });
  
  after(() => {
    stubDbGetTopSong.restore();
  });
  
  it('should test songs api endpoint and return top songs', async () => {
    stubDbGetTopSong.resolves([
      {
        '_id':'672e7509bb74d76a72922a91',
        'song':'blinding lights',
        'artist':'the weeknd',
        'spotifyStreams':4281468720
      },
      {
        '_id':'672e7509bb74d76a72922a8f',
        'song':'shape of you',
        'artist':'ed sheeran',
        'spotifyStreams':3909458734
      },
      {
        '_id':'672e7509bb74d76a72922acc',
        'song':'sunflower - spider-man: into the spider-verse',
        'artist':'post malone',
        'spotifyStreams':3358704125
      }
    ]);
  
    const response = await request(app).get('/api/songs/top50');
    expect(response.body).to.deep.equal([
      {
        '_id':'672e7509bb74d76a72922a91',
        'song':'blinding lights',
        'artist':'the weeknd',
        'spotifyStreams':4281468720
      },
      {
        '_id':'672e7509bb74d76a72922a8f',
        'song':'shape of you',
        'artist':'ed sheeran',
        'spotifyStreams':3909458734
      },
      {
        '_id':'672e7509bb74d76a72922acc',
        'song':'sunflower - spider-man: into the spider-verse',
        'artist':'post malone',
        'spotifyStreams':3358704125
      }
    ]
    );
  });
  
  it('should test songs api endpoint and return 200 respond code', async () => {
    stubDbGetTopSong.resolves([
      {
        '_id':'672e7509bb74d76a72922a91',
        'song':'blinding lights',
        'artist':'the weeknd',
        'spotifyStreams':4281468720
      },
      {
        '_id':'672e7509bb74d76a72922a8f',
        'song':'shape of you',
        'artist':'ed sheeran',
        'spotifyStreams':3909458734
      },
      {
        '_id':'672e7509bb74d76a72922acc',
        'song':'sunflower - spider-man: into the spider-verse',
        'artist':'post malone',
        'spotifyStreams':3358704125
      }
    ]);
  
    const response = await request(app).get('/api/songs/top50');
    expect(response.statusCode).to.equal(200);
  });
    
    
  it('should test songs api endpoint and returns and error', async () => {
    stubDbGetTopSong.resolves([]);
  
    const response = await request(app).get('/api/songs/top50');
    expect(response.body).to.deep.equal(
      {
        'status': 500,
        'message': 'Server error while fetching songs'
      }
    );
  });
});
  
describe('api/songs/name/:name', () => {
  let app;
  
  before(() => {
    app = express();
    app.use('/api', router);
  });
  
  after(() => {
    stubDbGetSongsByName.restore();
  });
  
  it('should return songs with matching name', async () => {
    const mockSongs = [
      {
        _id: '671eade99f8bcdc26c684156',
        song: 'million dollar baby',
        artist: 'tommy richman',
        spotifyStreams: 390470936
      },
      {
        _id: '672eade99f8bcdc26c684157',
        song: 'million dollar baby - remix',
        artist: 'tommy richman',
        spotifyStreams: 123456789
      }
    ];
  
    stubDbGetSongsByName.resolves(mockSongs);
  
    const response = await request(app).get('/api/songs/name/million%20dollar%20baby');
      
    // Assert the response
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.equal(mockSongs);
  });
  
  it('should return 404 if no songs are found', async () => {
    stubDbGetSongsByName.resolves([]);
  
    const response = await request(app).get('/api/songs/name/nonexistent%20song');
      
    // Assert the response
    expect(response.statusCode).to.equal(404);
    expect(response.body).to.deep.equal({
      status: 404,
      message: 'Cannot find such song'
    });
  });
});
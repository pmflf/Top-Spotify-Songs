import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { db } from '../db/db.js';
import {promises as fs} from 'fs';
import * as seed from '../utils/seed.js';

chai.use(chaiAsPromised);


describe('seeding functions:', () => {
  let stubFs; 
  let mockDb;

  beforeEach(() => {
    stubFs = sinon.stub(fs, 'readFile');
    mockDb = sinon.mock(db);
  });

  afterEach(() => {
    stubFs.restore();
    mockDb.restore();
  });

  it('should read songs and return a song object', async () => {
    const expectation = mockDb.expects('createMany').withArgs([
      {song: 'test 1', artist: '10 cents', spotifyStreams: 12341203},
      {song: 'test 2', artist: 'coldplay', spotifyStreams: 2333451}
    ], 'songs');

    let resolveString = 'Track,Album Name,Artist,Release Date,Spotify Streams/\r?\n';
    resolveString += 'Test 1,album,10 cents,2/3/3,12341203/\r?\n';
    resolveString += 'Test 2,album,coldplay,2/3/4,2333451/\r?\n';
    stubFs.resolves(resolveString);
    await seed.getSongs();

    expectation.verify();
  });

  it('should read countries and return a list of countries', async () => {
    const expectation = mockDb.expects('createMany').withArgs([
      {'name': 'united kingdom', 'coordinates': [-3.435973, 55.378051]},
    ], 'countries');

    const stubDb = sinon.stub(db, 'readAll');
    const resolveArtists = [{name : 'coldplay', country: 'united kingdom'},
      {name: 'drake', country: 'canada'}];
      
    let resolveString = 'headers\r\n';
    resolveString += 'United Kingdom,GBR,GB,GBR,,55.378051,-3.435973,0,0,Q145,54.60,';
    resolveString += '-2.00,United Kingdom,country in Western Europe';
    stubFs.resolves(resolveString);
    stubDb.resolves(resolveArtists);
    await seed.getCountries();
    stubDb.restore();
    expectation.verify();
  });

  it('should read artists and return a list of artists containing their songs', async () => {
    const expectation = mockDb.expects('createMany').withArgs([
      {name : 'coldplay', country: 'united kingdom'}
    ], 'artists');

    const stubDb = sinon.stub(db, 'readAll');
    const resolveSongs = [{song: 'test 1', artist: 'coldplay', spotifyStreams: 12341203},
      {song: 'test 2', artist: 'coldplay', spotifyStreams: 2333451}];

    let resolveArtists = 'headers\r\n';
    resolveArtists += 'c,Coldplay,Coldplay,United Kingdom,rock,52130132,2142321';
    stubDb.resolves(resolveSongs);
    stubFs.resolves(resolveArtists);

    await seed.getArtists();

    stubDb.restore();

    expectation.verify();
  });
});


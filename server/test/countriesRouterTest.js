import express from 'express';
import request from 'supertest';
import * as chai from 'chai';
import router from '../routers/countriesRouter.js';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { db } from '../db/db.js';

const stubDbGetAllCountries = sinon.stub(db, 'getAllCountries');
const expect = chai.expect;
chai.use(chaiAsPromised);

describe('api/country', () => {
  let app;
  
  before(() => {
    // express instance stub
    // needed for supertest
    app = express();
    app.use('/api', router);
  });
  
  after(() => {
    stubDbGetAllCountries.restore();
  });
  
  it('should return countries with matching objects', async () => {
    const mockCountries = [
      {
        '_id': {
          '$oid': '673146e32ce7598e810ff350'
        },
        'name': 'afghanistan',
        'coordinates': [
          67.709953,
          33.93911
        ]
      },
      {
        '_id': {
          '$oid': '673146e32ce7598e810ff355'
        },
        'name': 'belgium',
        'coordinates': [
          4.469936,
          50.503887
        ]
      }
    ];
  
    stubDbGetAllCountries.resolves(mockCountries);
  
    const response = await request(app).get('/api/country');
      
    // Assert the response
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.deep.equal(mockCountries);
  });
  
  before(() => {
    // express instance stub
    // needed for supertest
    app = express();
    app.use('/api', router);
  });
  
  it('should return an error', async () => {
    stubDbGetAllCountries.resolves([]);
  
    const response = await request(app).get('/api/country');
      
    // Assert the response
    expect(response.statusCode).to.equal(500);
    expect(response.body).to.deep.equal({ status: 500, message: 'There was no data in database' });
  });
});
  

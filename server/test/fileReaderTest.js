import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import read from '../utils/readFile.js';

chai.use(chaiAsPromised);
const expect = chai.expect;


describe('readFile', ()=> {

  it('should read from csv and return a string', async () => {
    const data = ['row1,row2,row3', 'row12,row22,row32', ''];
    const url = './datasets/fakeData.csv';
    const returnedReadData = await read(url);

    expect(JSON.stringify(returnedReadData).trim()).to.deep.equal(JSON.stringify(data).trim());
  });


});
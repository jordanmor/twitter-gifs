const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const app = require('../src/index');

const { expect } = chai;
chai.use(chaiHttp);

// Test suite
describe('GET /api/twitter/trends', function () {

  it('should return the latest trends from twitter Api', done => {

    chai.request(app)
      .get('/api/twitter/trends')
      .end( function(err, res) {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body).to.not.be.empty;
        expect( {res: {body: [{id: '1'}] }} ).to.be.a('object');
        expect( {res: {body: [{id: '1'}] }} ).to.have.nested.property('res.body[0].id');
        expect( {res: {body: [{id: '1'}] }} ).to.have.nested.property('res.body[0].id').that.is.a('string');
        done();
      });
  });
 
});

describe('POST /api/twitter/tweets', function () {

  it('should return a 401 status error when trying to post tweet without valid credentials', done => {
    chai.request(app)
      .post('/api/twitter/tweet')
      // No Passport authentication
      .type('form')
      .send({
        text:"#snow",
        gif:"https://media3.giphy.com/media/14uJKhQMZ1wLfO/giphy-downsized.gif"
      })
      .end( (err, res) => {
        expect(res).to.have.status(401);
        done();
      });
  });

});
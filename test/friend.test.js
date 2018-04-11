var should = require('should');
var axios = require('axios');
const db = require('../db.js').db;

const baseUrl = `http://localhost:${process.env.PORT}`; 

describe('test friend endpoints', () => {
  describe('add friends', () => {
    it('sample test case', done => {
      done();
    })
  });

  describe('add friend', () => {
    it('success case', done => {
      axios.post(`${baseUrl}/friend`, {
        friends: [
          "email3@gmail.com",
          "email4@gmail.com"
        ]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(resp => {
        return db.query(`select * from connection where requestor='email3@gmail.com' and type='friend'`)
      })
      .then(res => {
        res.length.should.eql(1);
        res[0].target.should.eql('email4@gmail.com');
        done();
      })
      .catch(e => {
        console.log(e.message);
        console.log(e);
        done(e.message);
      });
    });

    it('invalid input not enough input email', done => {
      axios.post(`${baseUrl}/friend`, {
        friends: [
          "email3@gmail.com"
        ]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        done('should not be here');
      })
      .catch(e => {
        e.response.status.should.eql(400);
        done();
      });
    });

    it('invalid input identical email', done => {
      axios.post(`${baseUrl}/friend`, {
        friends: [
          "email3@gmail.com",
          "email3@gmail.com"
        ]
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(() => {
        done('should not be here');
      })
      .catch(e => {
        e.response.status.should.eql(400);
        done();
      });
    });
  });
});

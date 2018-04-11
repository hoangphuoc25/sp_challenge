var should = require('should');
var axios = require('axios');
const db = require('../db.js').db;

const baseUrl = `http://localhost:${process.env.PORT}`; 

describe('test friend endpoints', () => {
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

    it('should not add friend if blocked', done => {
      axios.post(`${baseUrl}/blocking`, {
          requestor: 'email3@gmail.com',
          target: 'email4@gmail.com',
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(() => {
          return axios.post(`${baseUrl}/friend`, {
            friends: [
              "email4@gmail.com",
              "email3@gmail.com"
            ]
          }, {
            headers: {
              'Content-Type': 'application/json'
            }
          })
        })
        .then(() => {
          done('should not reach here')
        })
        .catch(err => {
          err.response.status.should.eql(400);
          err.response.data.message.should.eql('Unable to add friend: in blocklist');
          done();
        })
    });
  });

  describe('get friends', () => {
    beforeEach('setup', done => {
      db.query(`insert into connection 
          values (DEFAULT, $/email1/, $/email2/, 'friend'), (DEFAULT, $/email2/, $/email1/, 'friend')`, {
        email1: 'email1@gmail.com',
        email2: 'email2@gmail.com',
      })
      .then(() => done())
    });

    it('success case', done => {
      axios.get(`${baseUrl}/friends?email=email1@gmail.com`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(resp => {
          should(resp.data.friends.length).equal(1);
          should(resp.data.friends.length).equal(resp.data.count);
          should(resp.data.friends[0]).equal('email2@gmail.com');
          done()
        })
        .catch(e => {
          console.error(e.stack);
          done(e.message);
        });
    });

    it('empty case', done => {
      axios.get(`${baseUrl}/friends?email=email9@gmail.com`, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(resp => {
          should(resp.data.friends.length).equal(0);
          should(resp.data.friends.length).equal(resp.data.count);
          done()
        })
        .catch(e => {
          console.error(e.stack);
          done(e.message);
        });
    });
  });

  describe('get mutual friends', () => {
    beforeEach('setup', done => {
      const email1 = 'email1@gmail.com', email2 = 'email2@gmail.com',
            email3 = 'email3@gmail.com', email4 = 'email4@gmail.com';

      db.query(`insert into connection
          values (DEFAULT, $/email1/, $/email2/, 'friend'), (DEFAULT, $/email2/, $/email1/, 'friend'),
          (DEFAULT, $/email1/, $/email3/, 'friend'), (DEFAULT, $/email3/, $/email1/, 'friend'),
          (DEFAULT, $/email3/, $/email4/, 'friend'), (DEFAULT, $/email4/, $/email3/, 'friend'),
          (DEFAULT, $/email4/, $/email2/, 'friend'), (DEFAULT, $/email2/, $/email4/, 'friend')`, {
        email1,
        email2,
        email3,
        email4,
      })
      .then(() => done())
    });

    it('get mutual friends', done => {
      axios.get(`${baseUrl}/commonFriends?email1=email1@gmail.com&email2=email4@gmail.com`)
        .then(result => {
          result.status.should.eql(200);
          result.data.success.should.eql(true);
          result.data.friends.length.should.eql(2);
          result.data.friends.should.containEql('email3@gmail.com');
          result.data.friends.should.containEql('email2@gmail.com');
          result.data.count.should.eql(result.data.friends.length);
          done();
        })
    });
  });

  describe('block', () => {
    it('success case', done => {
      axios.post(`${baseUrl}/blocking`, {
          requestor: 'email3@gmail.com',
          target: 'email4@gmail.com',
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(resp => {
          resp.status.should.eql(200);
          return db.query(`select * from block_list where blocker='email3@gmail.com'`)
        })
        .then(result => {
          result.length.should.eql(1);
          result[0].blockee.should.eql('email4@gmail.com');
          done();
        })
        .catch(e => {
          done(e.message);
        })
    });

    it('invalid input idential emails', done => {
      axios.post(`${baseUrl}/blocking`, {
          requestor: 'email3@gmail.com',
          target: 'email3@gmail.com',
        }, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(resp => {
          done('should not reach here');
        })
        .catch(e => {
          e.response.status.should.eql(400);
          e.response.data.message.should.eql('Emails must be different');
          done();
        })
    });
  });

});

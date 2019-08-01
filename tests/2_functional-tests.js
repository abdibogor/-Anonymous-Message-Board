/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
const ObjectId = require('mongoose').Types.ObjectId;

const { Thread } = require('../models/Thread');

chai.use(chaiHttp);

const threads = [
  {
    _id: new ObjectId(),
    board: "test",
    text: "Thread 1",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: []
  },
  {
    _id: new ObjectId(),
    board: "test",
    text: "Thread 2",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: []
  },{
    _id: new ObjectId(),
    board: "test",
    text: "Thread 3",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: []
  },{
    _id: new ObjectId(),
    board: "test",
    text: "Thread 4",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: []
  },{
    _id: new ObjectId(),
    board: "test",
    text: "Thread 5",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: [
      {
        _id: new ObjectId(),
        text: "Thread reply 1",
        created_on: new Date().toISOString(),
        reported: false,
        delete_password: "1234"
      },
      {
        _id: new ObjectId(),
        text: "Thread reply 2",
        created_on: new Date().toISOString(),
        reported: false,
        delete_password: "1234"
      },
      {
        _id: new ObjectId(),
        text: "Thread reply 3",
        created_on: new Date().toISOString(),
        reported: false,
        delete_password: "1234"
      },
      {
        _id: new ObjectId(),
        text: "Thread reply 4",
        created_on: new Date().toISOString(),
        reported: false,
        delete_password: "1234"
      },
      {
        _id: new ObjectId(),
        text: "Thread reply 5",
        created_on: new Date().toISOString(),
        reported: false,
        delete_password: "1234"
      }
    ]
  },{
    _id: new ObjectId(),
    board: "test",
    text: "Thread 6",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: []
  },{
    _id: new ObjectId(),
    board: "test",
    text: "Thread 7",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: []
  },{
    _id: new ObjectId(),
    board: "test",
    text: "Thread 8",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: []
  },{
    _id: new ObjectId(),
    board: "test",
    text: "Thread 9",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: []
  },{
    _id: new ObjectId(),
    board: "test",
    text: "Thread 10",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: []
  },{
    _id: new ObjectId(),
    board: "test",
    text: "Thread 11",
    delete_password: "1234",
    created_on: new Date().toISOString(),
    bumped_on: new Date().toISOString(),
    reported: false,
    replies: []
  },
];


describe("Functional Tests", function() {

  before(function(done) {
    // runs before all tests in this block
    Thread.insertMany(threads)
      .then(() => done());
  });

  after(function(done) {
    // runs after all tests in this block
    Thread.deleteMany({})
      .then(() => done());
  });

  

  describe('API ROUTING FOR /api/threads/:board', function() {
    it("POST", function(done) {
      chai.request(server)
        .post('/api/threads/test')
        .send({
          board: "test",
          text: "New Thread",
          delete_password: "1234"
        })
        .end(function(err, res){
          
         assert.equal(res.status, 200);
         Thread.find({ board: "test" })
            .then(docs => {
              assert.equal(docs.length, 12);  
              done();
            })
            .catch(err => done(err));
        });

    });

    it("GET", function(done) {
      chai.request(server)
        .get('/api/threads/test')
        .end(function(err, res){
          
         assert.equal(res.status, 200);
         assert.isArray(res.body);
         assert.equal(res.body.length, 10);
         assert.property(res.body[0], "_id");
         assert.property(res.body[0], "text");
         assert.property(res.body[0], "created_on");
         assert.property(res.body[0], "bumped_on");
         assert.property(res.body[0], "replies");
         assert.isArray(res.body[0].replies);
         done();
        });
    });

    it("DELETE", function(done) {
      chai.request(server)
      .delete('/api/threads/test')
      .send({
        board: "test",
        thread_id: threads[0]._id,
        delete_password: threads[0].delete_password
      })
      .end(function(err, res){
        
       assert.equal(res.status, 200);
       assert.equal(res.body, "success");
       Thread.find({ board: "test" })
          .then(docs => {
            assert.equal(docs.length, 11);  
            done();
          })
          .catch(err => done(err));
      });

    });

    it("PUT", function(done) {

      chai.request(server)
      .put('/api/threads/test')
      .send({
        board: "test",
        thread_id: threads[1]._id,
      })
      .end(function(err, res){
        
       assert.equal(res.status, 200);
       assert.equal(res.body, "success");
       Thread.findById(threads[1]._id)
          .then(doc => {
            assert.isTrue(doc.reported);  
            done();
          })
          .catch(err => done(err));
      });

    });

  });

  describe('API ROUTING FOR /api/replies/:board', function() {

    it("POST", function(done) {
      chai.request(server)
        .post('/api/replies/test')
        .send({
          board: "test",
          text: "New Reply",
          delete_password: "1234",
          thread_id: threads[3]._id
        })
        .end(function(err, res){
          
         assert.equal(res.status, 200);
         Thread.findById(threads[3]._id)
            .then(doc => {
              assert.equal(doc.replies.length, 1);  
              done();
            })
            .catch(err => done(err));
        });


    });

    it("GET", function(done) {
      chai.request(server)
        .get('/api/replies/test')
        .query({ thread_id: threads[3]._id.toHexString() })
        .end(function(err, res){
          
         assert.equal(res.status, 200);
         assert.equal(res.body._id, threads[3]._id);
         assert.equal(res.body.text, threads[3].text);
         assert.property(res.body, "created_on");
         assert.property(res.body, "bumped_on");
         assert.isArray(res.body.replies);
         assert.equal(res.body.replies.length, 1);
         done();
        });
    });

    it("DELETE", function(done) {
      chai.request(server)
      .delete('/api/replies/test')
      .send({
        board: "test",
        thread_id: threads[4]._id,
        delete_password: threads[4].replies[2].delete_password,
        reply_id: threads[4].replies[2]._id
      })
      .end(function(err, res){
        
       assert.equal(res.status, 200);
       assert.equal(res.body, "success");
       Thread.findById(threads[4]._id)
          .then(doc => {
            assert.equal(doc.replies.length, 4);
            done();
          })
          .catch(err => done(err));
      });
    });

    it("PUT", function(done) {

      chai.request(server)
      .put('/api/replies/test')
      .send({
        board: "test",
        thread_id: threads[4]._id,
        reply_id: threads[4].replies[1]._id
      })
      .end(function(err, res){
        
       assert.equal(res.status, 200);
       assert.equal(res.body, "success");
       Thread.findById(threads[4]._id)
          .then(doc => {
            assert.isTrue(doc.replies[1].reported);  
            done();
          })
          .catch(err => done(err));
      });

    });

  });
});


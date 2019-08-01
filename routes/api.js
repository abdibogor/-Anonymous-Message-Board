/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

const { Thread } = require("../models/Thread");

module.exports = function (app) {
  
  app.route('/api/threads/:board')
      .get(async (req, res) => {
        const board = req.params.board;

        try {
          const threads = await Thread.find({ board }).select("-reported -delete_password").sort("-bumped_on").limit(10);
          let parsedThreads = [];
          for (let i = 0; i < threads.length; i++) {
            parsedThreads.push({
              _id: threads[i]._id,
              text: threads[i].text,
              created_on: threads[i].created_on,
              bumped_on: threads[i].bumped_on,
              replies: threads[i].replies.map(reply => {
                return {
                  _id: reply._id,
                  text: reply.text,
                  created_on: reply.created_on
                };
              }).slice(0,3).filter(reply => reply !== null)
            })
          }
          res.json(parsedThreads);
        } catch (e) {
          res.status(400).json();
        }

      })
      .post(async (req, res) => {
        const board = req.params.board;
        const body = req.body;
        
        try {
          if (!board || !body || board.trim() === 0 || Object.keys(body).length !== 3) throw "invalid input";
          const newThread = new Thread({
            board,
            text: body.text,
            delete_password: body.delete_password
          });

          const thread = await newThread.save();
          res.redirect(`/b/${board}`)
        } catch (e) {
          if (e === "invalid input") {
            res.status(400).json({
              failed: e
            })
          } else {
            res.status(400).json();
          }
        }
      })
      .delete(async (req, res) => {
        const board = req.params.board;
        const body = req.body;

        try {
          const thread = await Thread.findOneAndRemove({ _id: body.thread_id, board, delete_password: body.delete_password });


          if (!thread) throw "incorrect password";

          res.json("success");
          } catch (e) {
            if (e === "incorrect password") {
              res.status(400).json("incorrect password");
            } else {
              res.status(400).json();
            }
          }
      })
      .put(async (req, res) => {
        const board = req.params.board;
        const body = req.body;

        try {
          const thread = await Thread.findByIdAndUpdate(body.thread_id, { $set: { reported: true } }, { new: true });

          if (!thread) throw "incorrect thread_id";

          res.json("success");

        } catch (e) {
          res.status(400).json("incorrect thread_id");
        }

      });
    
  app.route('/api/replies/:board')
      .get(async (req, res) => {
        const board = req.params.board;
        const thread_id = req.query.thread_id;

        try {
          if (!thread_id) throw "please provide thread_id";
          const thread = await Thread.findById(thread_id).select("-reported -delete_password").sort("-bumped_on").limit(10);
          const parsedThread = {
            _id: thread._id,
            text: thread.text,
            created_on: thread.created_on,
            bumped_on: thread.bumped_on,
            replies: thread.replies.map(reply => {
              return {
                _id: reply._id,
                text: reply.text,
                created_on: reply.created_on
              };
            }).filter(reply => reply !== null)
          };

          res.json(parsedThread);
        } catch (e) {
          res.status(400).json();
        }
      })
      .post(async (req, res) => {
        const board = req.params.board;
        const body = req.body;

        try {
          if (!board || !body || board.trim().length === 0 || Object.keys(body).length !== 4 ) throw "invalid input";

          const dateNow =  new Date().toISOString();

          const update = {
            bumped_on: dateNow,
            $push: {
              replies: {
                text: body.text,
                delete_password: body.delete_password,
                created_on: dateNow
              }
            }
          };

          const updateThread = await Thread.findByIdAndUpdate(body.thread_id, update, { new: true });

          if (!updateThread) throw `No thread found for ${body.thread_id}`;

          res.redirect(`/b/${board}/${body.thread_id}`);

        } catch (e) {
          if ([`No thread found for ${body.thread_id}`, "invalid input"].includes(e)) {
            res.status(400).json({
              failed: e
            });
          } else {
            res.status(400).json();
          }
        }
      })
      .delete(async (req, res) => {
        const board = req.params.board;
        const body = req.body;

        try {
          const thread = await Thread.findOneAndUpdate(
              { 
                _id: body.thread_id, 
                board,
              },
              { 
                $pull: {
                    replies: {
                      _id: body.reply_id, 
                      delete_password: body.delete_password
                    }                        
                  }   
              },
              { 
                new: true 
              }
            );

            // { $pull: { results: { score: 8 , item: "B" } } }

          if (!thread) throw "incorrect password";

          res.json("success");

        } catch (e) {
          console.log(e);
          res.status(400).json("incorrect password");
        }
      })
      .put(async (req, res) => {
        const board = req.params.board;
        const body = req.body;

        try {
          const thread = await Thread.findOneAndUpdate(
            { 
              _id: body.thread_id, 
              board,
              replies: { 
                $elemMatch: {
                  _id: body.reply_id, 
                }                       
              } 
            }
            , { 
                $set: { 
                "replies.$.reported": true    
              } 
            },
            { 
              new: true 
            }
          );

          if (!thread) throw "failed";

          res.json("success");
        } catch (e) {
          res.status(400).json("failed")
        }
      })
};

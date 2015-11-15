var Datastore = require('nedb');
var _ = require('underscore');

/**
 * Our dal + dao mixed into one interface :)
 * Consider switching to promises, bleh
 *
 * nedb is pretty sick as it maintains a mongodb like interface with sqlite type file db capabilities
 */
var dbWrapper = function (logger) {

  var db = { }; // private db holder

  var self = {

  };

  //
  // public
  //

  self.initialize = function () {

    db.users = new Datastore({ filename: 'users.db', autoload: true });

    db.votes = new Datastore({ filename: 'votes.db', autoload: true });

    db.users.loadDatabase(function (err) {
      if (err) {
        throw err;
      }

      logger.info('loaded users');
    });

    db.votes.loadDatabase(function (err) {
      if (err) {
        throw err;
      }

      db.votes.ensureIndex({ fieldName: 'userId' }, function (err) {
        if (err) {
          throw err;
        }
      });

      db.votes.ensureIndex({ fieldName: 'songId' }, function (err) {
        if (err) {
          throw err;
        }
      });

      logger.info('loaded votes');

    });

    // auto-compact every hour
    db.users.persistence.setAutocompactionInterval(60000 * 60);

  };

  //
  // user
  //

  self.addUser = function (user, cb) {

    if (!user._id) {
      user._id = user.id;

      if (!user._id) {
        cb(new Error('Invalid userId'));
      }
    }

    user.id = user._id;
    user.queue = [];
    db.users.insert(user, cb);
  };

  self.getUser = function (id, cb) {
    db.users.findOne({_id : id}, cb);
  };

  self.updateUser = function (user, cb) {

    if (!user._id) {
      user._id = user.id;

      if (!user._id) {
        cb(new Error('Invalid userId'));
      }
    }

    user.id = user._id;

    if (!user.hasOwnProperty('queue')) {
      user.queue = [];
    }

    db.users.update({_id: user._id}, user, {}, cb);
  };

  //
  // votes
  //

  self.getUserVotes = function (userId, cb) {
    db.votes.find({userId: userId}, cb);
  };

  self.voteUp = function (userId, songId, cb) {
    voteUpsert(userId, songId, 1, cb);
  };

  self.voteDown = function (userId, songId, cb) {
    voteUpsert(userId, songId, -1, cb);
  };

  self.voteClear = function (userId, songId, cb) {
    try {
      db.votes.remove({_id: createVoteId(userId, songId)}, {}, cb);
    } catch (err) {
      cb(err);
    }
  };

  self.getVotesForSong = function (songId, cb) {

    db.votes.find({songId: songId}, function (err, votes) {
      if (err) {
        return cb(err);
      }

      var sum = 0;

      _.each(votes, function (vote) {
        sum += vote.value;
      });

      cb(null, sum);

    });

  };


  //
  // private
  //


  var createVoteId = function (userId, songId) {

    if (userId && songId)
      return userId + '-' + songId;

    throw new Error('userId and/or songId cannot be null');
  }

  var voteUpsert = function (userId, songId, value, cb) {

    try {
      var vote = {
        _id: createVoteId(userId, songId),
        userId: userId,
        songId: songId,
        value: value
      }

      db.votes.update({_id: vote._id}, vote, {upsert: true}, cb);
    } catch (err) {
      cb(err);
    }

  }



  // initialize self on load
  self.initialize();

  return self;

};

module.exports = dbWrapper;


var expect = require("chai").expect;
var assert = require('chai').assert;

var mpdWrapper = require('../lib/mpd-wrapper')('localhost', 6600);

describe("mpd", function() {

  it("should get mpd status", function(done) {

    mpdWrapper.getStatus(function (err, status) {
      console.log(status);
      expect(status.volume).to.equal(-1);
      done();
    });

  });

  it("should get the current song", function(done) {

    mpdWrapper.getCurrentSong(function (err, song) {
      console.log(song);
      done();
    });

  });

  it("should update the db", function(done) {

    mpdWrapper.updateDb(function (err, obj) {
      console.log(obj);
      done();
    });

  });

  it("should get current playlist info", function(done) {

    mpdWrapper.getCurrentPlaylistInfo(function (err, obj) {
      console.log(obj);
      done();
    });

  });

  it("should get upcoming songs", function(done) {

    mpdWrapper.getUpcomingSongs(function (err, obj) {
      console.log(obj);
      done();
    });

  });

  it("should find music", function(done) {

    mpdWrapper.search('tina', function (err, obj) {
      console.log(obj);
      expect(obj.length).to.equal(1);
      done();
    });

  });

  it("should get played songs", function(done) {

    mpdWrapper.getPlayedSongs(function (err, obj) {
      console.log(obj);
      done();
    });

  });

  it("should get all songs in the db", function(done) {

    mpdWrapper.getAllSongs(function (err, obj) {
      console.log(obj);
      expect(obj.length).to.equal(3);
      done();
    });

  });

  it("should start playing music", function(done) {

    mpdWrapper.play(function (err, obj) {
      console.log(obj);
      done();
    });

  });

  it("should stop playing music", function(done) {

    mpdWrapper.stop(function (err, obj) {
      console.log(obj);
      done();
    });

  });

});

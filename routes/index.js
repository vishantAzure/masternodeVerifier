var express = require('express');
const MongoClient = require('mongodb').MongoClient;
var db;

module.exports = function () {

  MongoClient.connect('mongodb://localhost:27017', function (err, client) {
    console.log("Connected successfully to server");
    db = client.db("explorerdb");
  });

  function update() {
    const collection = db.collection('nodeschemas');
    return new Promise(function (resolve, reject) {

      collection.updateMany({}, { $set: { MNV: "N" } }, function (err, res) {
        if (err) reject(err);
        console.log('deleted');
        resolve(res);
      })

    });
  }
  return { Update: update }
}();

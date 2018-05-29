var express = require('express')
  , path = require('path')
  , bitcoinapi = require('./lib/api')
  , favicon = require('static-favicon')
  , logger = require('morgan')
  , cron = require('node-cron')
  , cookieParser = require('cookie-parser')
  , bodyParser = require('body-parser')
  , settings = require('./lib/settings')
  , routes = require('./routes/index')
  , request = require('request')
  , Model = require('./lib/model');
var http = require('http');
var Routes = require('./routes/index');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/explorerdb');

var app = express();
app.set('port', 3001);
var server = http.createServer(app);
server.listen(3001);
server.on('error', function (error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
});
server.on('listening', function () {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
});

// bitcoinapi
bitcoinapi.setWalletDetails(settings.walletesco);
bitcoinapi.setAccess('only', ['getinfo', 'getnetworkhashps', 'getmininginfo', 'getdifficulty', 'getconnectioncount',
  'getblockcount', 'getblockhash', 'getblock', 'getrawtransaction', 'getpeerinfo', 'gettxoutsetinfo', 'verifymessage']);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


cron.schedule('*/2 * * * *', function () {
console.log('====started====')
  Routes.Update().then(function (res) {

    Model.find({}, function (err, docs) {
      if (err) return res.render("index", { "message": err });

      bitcoinapi.masternode().then(function (result) {

        try {
          for (var i = 1; i <= docs.length; i++) {

            for (var key in result) {

              if (result[key] == docs[i].EWRA && docs[i].MNV == "N") {

                var conditions = { EWRA: result[key] }
                  , update = { MNV: 'Y' }
                  , options = {};

                Model.update(conditions, update, options, function (err1, data1) {
                  if (err) console.log(err1);
                  console.log('updated');
                });
              }
            }
          }
        } catch (e) {
          throw (e);
        }

      })
    })
  }).catch(function (error) {
    console.log(error)
  });
});

app.use('/payload', function(){
  console.log('change received');
})

app.use('/verfyMessage', function (req, res) {

  bitcoinapi.masternode().then(function (result1) {

    let status = 0;
    for (var key in result1) {
      if (result1[key] == req.body.address) {
        status = 1;
        break;
      }
    }
    if (status == 1) {
      return bitcoinapi.app(req, res).then(function (result2) {

        var obj = new Model({
          UserName: req.body.uname,
          EWRA: req.body.address,
          Signed_Message: req.body.signmessage,
          MNV: "Y"
        })
        try {
          Model.find({}, function (error3, result3) {
            if (error3) return res.render("index", { "message": "error" });

            for (var i = 0; i < result3.length; i++) {
              if (result3[i].EWRA == req.body.address)
                return res.render("index", { "message": result2 });
            }
            obj.save(function (error4) {
              if (error4) return res.render("index", { "message": "error" });
              res.render("index", { "message": result2 });
            })
          });
        } catch (e) {
          throw (e);
        }
      })
    } else {
      res.render("index", { "message": "masternode is offline" });
    }
  }).catch(function (error1) {
    return res.render("index", { "message": error1 });
  });

});

app.get('*', function (req, res) {

  // xlsxj = require("xlsx-to-json");
  // xlsxj({
  //   input: "public/ESCO.xlsx", 
  //   output: "output.json"
  // }, function(err, result) {
  //   if(err) {
  //     console.error(err);
  //   }else {
  //     console.log(result);
  //   }
  // });

  res.render("index", { "message": "" })

});

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    console.log(err);
  });
}

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.log(err);
});

module.exports = app;

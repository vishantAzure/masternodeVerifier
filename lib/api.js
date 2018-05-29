var bitcoin = require('bitcoin');
var express = require('express');

module.exports = function () {

  function start(req, res) {
    return new Promise(function (resolve, reject) {
      command = [{
        method: "verifymessage",
        params: [req.body.address,
        req.body.signmessage,
        req.body.uname]
      }];

      client.cmd(command, function (err, response) {
        if (err) reject(err);
        resolve(response);
      });
    });
  }

  function findmasternode() {
    return new Promise(function (resolve, reject) {
      command = [{
        method: "masternodelist",
        params: ["pubkey"]
      }];
      client.cmd(command, function (err, response) {
        if (err) reject(err);
        resolve(response);
      });
    });
  }

  function hasAccess(req, res, next) {
    if (accesslist.type == 'all') {
      return next();
    }

    var method = req.path.substring(1, req.path.length);
    if ('undefined' == typeof accesslist[method]) {
      if (accesslist.type == 'only') res.end('This method is restricted.');
      else return next();
    }
    else {
      if (accesslist[method] == true) {
        return next();
      }
      else res.end('This method is restricted.');
    }
  }

  function specialApiCase(method_name) {
    var params = [];
    if (method_name == 'sendmany') {
      var after_account = false;
      var before_min_conf = true;
      var address_info = {};
      for (var parameter in query_parameters) {
        if (query_parameters.hasOwnProperty(parameter)) {
          if (parameter == 'minconf') {
            before_min_conf = false;
            params.push(address_info);
          }
          var param = query_parameters[parameter];
          if (!isNaN(param)) {
            param = parseFloat(param);
          }
          if (after_account && before_min_conf) {
            address_info[parameter] = param;
          }
          else {
            params.push(param);
          }
          if (parameter == 'account') after_account = true;
        }
      }
      if (before_min_conf) {
        params.push(address_info);
      }
    }

    return [{
      method: method_name,
      params: params
    }];
  }

  var accesslist = {};
  accesslist.type = 'all';
  var client = {};
  var wallet_passphrase = null;
  var requires_passphrase = {
    'dumpprivkey': true,
    'importprivkey': true,
    'keypoolrefill': true,
    'sendfrom': true,
    'sendmany': true,
    'sendtoaddress': true,
    'signmessage': true,
    'signrawtransaction': true
  };

  function setAccess(type, access_list) {
    //Reset//
    accesslist = {};
    accesslist.type = type;

    if (type == "only") {
      var i = 0;
      for (; i < access_list.length; i++) {
        accesslist[access_list[i]] = true;
      }
    }

    if (type == "restrict") {
      var i = 0;
      for (; i < access_list.length; i++) {
        accesslist[access_list[i]] = false;
      }
    }

    //Default is for security reasons. Prevents accidental theft of coins/attack

    if (type == 'default-safe') {
      accesslist.type = 'restrict';
      var restrict_list = ['dumpprivkey', 'walletpassphrasechange'];
      var i = 0;
      for (; i < restrict_list.length; i++) {
        accesslist[restrict_list[i]] = false;
      }
    }
  };

  function setWalletDetails(details) {
    if ('undefined' == typeof details.rpc) {
      client = new bitcoin.Client(details);
    }
    else {
      client = details;
    }
  };

  function setWalletPassphrase(passphrase) {
    wallet_passphrase = passphrase;
  };

  return {
    app: start,
    masternode: findmasternode,
    setAccess: setAccess,
    setWalletDetails: setWalletDetails,
    setWalletPassphrase: setWalletPassphrase
  }
}();

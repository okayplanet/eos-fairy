const express = require('express');
const os = require("os");
Eos = require('eosjs')

var bigDec = require("big-decimal");

if(os.type() != "Linux") {
  console.log("eos-fairy is currently only available for linux");
  process.exit(1);
}

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

config = {
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // 32 byte (64 char) hex string
  httpEndpoint: 'http://127.0.0.1:8888',
  mockTransactions: () => 'pass', // or 'fail'
  transactionHeaders: (expireInSeconds, callback) => {
    callback(null/*error*/, headers)
  },
  expireInSeconds: 60,
  broadcast: true,
  debug: false, // API and transactions
  sign: true
}

var eos = Eos(config)
var app = express();

app.get('/', function (req, res) {
  var response = '<html><title>EOS Fairy</title><body>Welcome to eos-fairy<br/><br/>';
  response += 'APIs<br/>';
  response += '/eos-fairy/account/:acct<br/>';
  response += '</body></html>';
  res.send(response);
});

app.get('/eos-fairy/account/:acct', async (req, res, next) => {
    const acct = req.params.acct;
    console.log("/eos-fairy/account/" + acct);

    var staked = await eos.getAccount(acct)
    var unstaked = await eos.getCurrencyBalance('eosio.token', acct, 'EOS')

    if(staked != null && unstaked != null) {
      res.send(formatApiResult({
        "staked": staked,
        "unstaked": unstaked
      }));
    } else {
      res.send({});
    }
})

function formatString(string) {
  if(string.indexOf(' EOS') > -1) {
    string = string.replace(' EOS', '')
  }
  return string
}

function formatApiResult(ret) {
  var unstaked = formatString(ret.unstaked.toString())
  var netStaked = formatString(ret.staked.total_resources.net_weight.toString())
  var cpuStaked = formatString(ret.staked.total_resources.cpu_weight.toString())

  var staked = new bigDec(cpuStaked).add(new bigDec(netStaked))
  var balance = staked.add(new bigDec(unstaked))

  return {
    "balance": balance.toString(),
    "staked": staked.toString(),
    "unstaked": unstaked,
    "net_staked": netStaked,
    "cpu_staked": cpuStaked
  }
}

app.listen(3000, function () {
  console.log('Starting eos-fairy on port 3000!');
});

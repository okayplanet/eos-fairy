# EOS Fairy 

EOS Fairy wraps nodeos's rpcapi with an express service.<br/>
This means that nodeos also should be running for this to work.

```bash
nodeos --data-dir ~/.eos/data --p2p-peer-address node2.eosnewyork.io:6987 --genesis-json ~/.eos/genesis.json --http-server-address 127.0.0.1:9998 --p2p-listen-endpoint 127.0.0.1:9999
```

## Purpose

Above

## To Do

A list of additions and improvements:

* [x] Fix decimal limit, perhaps with BigDecimal 
* [ ] Add config and refactor hardcoded values 
* [ ] Add more endpoints 
* [ ] Add tls/ssl support 
* [ ] Add option to download geth from URL, handle tar 
* [ ] Add support for other OS? Nah...

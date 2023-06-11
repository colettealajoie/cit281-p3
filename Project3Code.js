

function valueFromArray(arr) {
    return arr.reduce(
        (acc, val) =>
            Array.isArray(val) ? valueFromArray(val) : acc + valueFromCoinObject(val), 0)};

function valueFromCoinObject(obj) {
    const {denom = 0, count = 0} = obj;
    return validDenomination(denom) ? denom * count : 0;}

function validDenomination(coin) {
    return [1, 5, 10, 25, 50, 100].indexOf(coin) !== -1;}

function coinCount(...coinage) {
    return valueFromArray(coinage);}

module.exports = function coinCount() {

}
  


console.log("{}", coinCount({denom: 5, count: 3}));
console.log("{}s", coinCount({denom: 5, count: 3},{denom: 10, count: 2}));
const coins = [{denom: 25, count: 2},{denom: 1, count: 7}];
console.log("...[{}]", coinCount(...coins));
console.log("[{}]", coinCount(coins));

//-----------------------------------------------------------------------------------

const fs = require('fs');

const fastify = require('fastify')();
                                                
const coinCount = require('./p3-module');





fastify.get('/', (request, reply) => {
    const filePath = `${__dirname}/index.html`;
  
    fs.readFile(filePath, (err, data) => {
      if (err) {
        reply.status(500).send({ error: err });
        return;
      }
  
      reply
        .status(200)
        .header('Content-Type', 'text/html; charset=utf-8')
        .send(data);
    });
  });

  fastify.get('/coin', (request, reply) => {
    const { denom = 0, count = 0 } = request.query;
  
    const coinValue = coinCount(parseInt(denom), parseInt(count));
  
    reply
      .status(200)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(`<h2>Value of ${count} of ${denom} is ${coinValue}</h2><br /><a href="/">Home</a>`);
  });


  fastify.get('/coins', (request, reply) => {
    const { option } = request.query;
  
    let coinValue;
  
    switch (option) {
      case '1':
        coinValue = coinCount({ denom: 5, count: 3 }, { denom: 10, count: 2 });
        break;
      case '2':
        const coins = [
          { denom: 25, count: 2 },
          { denom: 1, count: 7 },
        ];
        coinValue = coinCount(...coins);
        break;
      case '3':
        const invalidCoins = [
          { denom: 5, count: 3 },
          { denom: 10, count: '2' },
        ];
        coinValue = coinCount(invalidCoins);
        break;
      default:
        coinValue = 0;
        break;
    }
  
    reply
      .status(200)
      .header('Content-Type', 'text/html; charset=utf-8')
      .send(`<h2>Option ${option} value is ${coinValue}</h2><br /><a href="/">Home</a>`);
  });
  


const listenIP = "localhost";
const listenPort = 8080;
  fastify.listen(listenPort, listenIP, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });

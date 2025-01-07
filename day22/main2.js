if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

function getNPrices(number) {
  const prices = [];
  for (i = 0; i < 2000; i++) {
    number = number ^ number << 6;
    number = number & 16777215;
    number = number ^ number >>> 5;
    number = number & 16777215;
    number = number ^ number << 11;
    number = number & 16777215;
    prices.push(number % 10);
  }
  return prices;
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  let initialSecrets = data.trim().split('\n')
    .map((row) => parseInt(row));

  const priceListsWithdiffs = initialSecrets.map(getNPrices)
    .map((prices) => (
      prices.map((price, i) => ([price, price - prices[i -1]])).slice(1)
    ));

  const pricesBySequence = priceListsWithdiffs.map((pricesAndDiffs) => (
    Object.fromEntries(pricesAndDiffs.map(([price, diff], i) => ([
      [diff, pricesAndDiffs[i - 1]?.[1], pricesAndDiffs[i - 2]?.[1], pricesAndDiffs[i - 3]?.[1]].join(),
      price,
    ])).slice(3).reverse())
  ));

  const sequences  = Array.from(new Set(pricesBySequence.map((obj) => Object.keys(obj)).flat()));
  const prices = sequences.map((sequence) => (
    pricesBySequence
      .map((priceBySequence) => priceBySequence[sequence] || 0)
      .reduce((sum, current) => (sum + current), 0)
  ));
  const result = Math.max(...prices);
  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

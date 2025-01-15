if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

try {
  const data = fs.readFileSync(filename, 'utf8');

  let inputs = Object.fromEntries(
    data.trim().split('\n\n')[0].split('\n')
      .map((row) => row.split(': '))
      .map(([key, value]) => ([key, parseInt(value)]))
  );

  let gates = data.trim().split('\n\n')[1].split('\n')
    .map((row) => row.split(' '));

  const rules = Object.fromEntries(gates.map((gate) => (
    [gate[4], gate.slice(0, 3)]
  )));

  const functions = {
    'AND': (a, b) => a & b,
    'OR': (a, b) => a | b,
    'XOR': (a, b) => a ^ b,
  };

  function compute(gate) {
    if (gate in inputs) {
      return inputs[gate];
    } else if (gate in rules) {
      const [a, op, b] =  rules[gate];
      return functions[op](compute(a), compute(b));
    }
  }

  const outputs = gates
    .map((gate) => gate[4])
    .filter((result) => result[0] === 'z')
    .sort()
    .map(compute)
    .reverse();

  const result = parseInt(outputs.join(''), 2);
  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

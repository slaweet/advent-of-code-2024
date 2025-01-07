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

  let connections = data.trim().split('\n')
    .map((row) => row.split('-'));

  const fromConnections = connections.reduce((acc, [from, to]) => {
    acc[from] = acc[from] || [];
    acc[from].push(to);
    acc[to] = acc[to] || [];
    acc[to].push(from);
    return acc;
  }, {})

  const fromTConnections = Object.fromEntries(
    Object.entries(fromConnections).filter(([key]) => key[0] === 't')
  )

  const connectionGroups = Object.entries(fromTConnections).map(([nodeA, nodesB]) => (
    nodesB.map((nodeB, i) => (
      nodesB.slice(i + 1).filter((nodeC) => (
        nodeB !== nodeA && nodeC !== nodeA && fromConnections[nodeC].includes(nodeB)
      )).map((nodeC) => ([nodeA, nodeB, nodeC].sort().join()))
    ))
  )).flat().flat();

  const result = new Set(connectionGroups).size;
  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

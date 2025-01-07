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

  const connections = data.trim().split('\n')
    .map((row) => row.split('-'));

  const edges = new Set(connections.map((c) => c.sort().join()));
  const vertices = new Set(connections.flat());

  cliquesBySize = {
    1: vertices,
    2: edges,
  }

  function isClique(clique, vertex) {
    const vertices = clique.split(',');
    return !vertices.includes(vertex)
      && vertices.every((v) => edges.has([v, vertex].sort().join()))
  }

  let cliqueSize = 3;
  for (cliqueSize = 3; cliqueSize < vertices.size && cliquesBySize[cliqueSize - 1].size > 0; cliqueSize++) {
    cliquesBySize[cliqueSize] = new Set(Array.from(cliquesBySize[cliqueSize - 1])
      .map((clique) => (
        Array.from(vertices)
          .filter((vertex) => isClique(clique, vertex))
          .map((vertex) => ([...clique.split(','), vertex].sort().join()))
      )).flat())
  }

  const result = cliquesBySize[cliqueSize - 2];
  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

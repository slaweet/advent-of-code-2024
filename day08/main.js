if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

try {
  const data = fs.readFileSync(filename, 'utf8');

  const areaMap = data.trim().split('\n').map((row) => row.split(''));
  const antenaLocations = {};
  for (var i = 0; i < areaMap.length; i++) {
    for (var j = 0; j < areaMap[i].length; j++) {
      antenaLocations[areaMap[i][j]] = antenaLocations[areaMap[i][j]]  || [];
      antenaLocations[areaMap[i][j]].push([i, j]);
    }
  }
  delete antenaLocations['.'];
  const antinodeLocations = new Set;

  const isInMap = ([x, y]) => !!areaMap[x]?.[y];

  Object.entries(antenaLocations).map(([key, locations]) => {
    for (var i = 0; i < locations.length; i++) {
      for (var j = i + 1; j < locations.length; j++) {
        const antena1 = locations[i];
        const antena2 = locations[j];
        const antinode1 = [
          antena1[0] + (antena1[0] - antena2[0]),
          antena1[1] + (antena1[1] - antena2[1]),
        ];
        if (isInMap(antinode1)) {
          antinodeLocations.add(antinode1.join(','));
        }

        const antinode2 = [
          antena2[0] + (antena2[0] - antena1[0]),
          antena2[1] + (antena2[1] - antena1[1]),
        ];
        if (isInMap(antinode2)) {
          antinodeLocations.add(antinode2.join(','));
        }
      }
    }
  });
  const result = Array.from(antinodeLocations).length;

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

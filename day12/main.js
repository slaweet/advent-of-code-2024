if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const {argv0} = require('process');
const {start} = require('repl');
const filename = process.argv[2];

function getRegionPrices(areaMap) {
  const directions = [[-1, 0], [0, 1], [1, 0], [0, -1]];

  function getRegion(startPlot) {
    const plotsToExplore = [startPlot];
    const area = [startPlot];
    while(plotsToExplore.length > 0) {
      const plot = plotsToExplore.pop();
      directions.forEach((direction) => {
        if (areaMap[plot[0]][plot[1]] === areaMap[plot[0] + direction[0]]?.[plot[1] + direction[1]]
          && !area.some(([x, y]) => x === plot[0] + direction[0] && y === plot[1] + direction[1])) {
          const newPlot = [plot[0] + direction[0], plot[1] + direction[1]];
          plotsToExplore.push(newPlot);
          area.push(newPlot);
        }
      });
    }
    return area;
  }


  const regions = []
  for (var i = 0; i < areaMap.length; i++) {
    for (var j = 0; j < areaMap[i].length; j++) {
      if (!regions.flat().some(([x, y]) => (x === i && y === j))) {
        regions.push(getRegion([i, j]));
      }
    }
  }

  const priceFactors = regions.map(function getPrice(region) {
    const area = region.length;
    const perimetr = region
      .map((plot) => (
        directions.map((direction) => (
          areaMap[plot[0]][plot[1]] === areaMap[plot[0] + direction[0]]?.[plot[1] + direction[1]] ? 0 : 1
        ))
      ))
      .flat()
      .reduce((sum, current) => (sum + current), 0);
    return [area, perimetr, areaMap[region[0][0]][region[0][1]]];
  });

  return priceFactors.map(([area, perimetr]) => area * perimetr);
}

try {
  const data = fs.readFileSync(filename, 'utf8');

  let areaMap = data.trim().split('\n').map((v) => v.split(''));

  const result = getRegionPrices(areaMap)
    .reduce((sum, current) => (sum + current), 0);

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

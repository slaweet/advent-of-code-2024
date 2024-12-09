if (process.argv.length < 3) {
  console.error('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

const fs = require('fs');
const filename = process.argv[2];

try {
  const data = fs.readFileSync(filename, 'utf8');

  const diskMap = data.trim().split('');

  const disk = diskMap
    .map((length, i) => Array(parseInt(length)).fill(`${i % 2 === 0 ? (i / 2) : '.'}`));
 
  const rearrangedDisk = JSON.parse(JSON.stringify(disk));
  for (let i = disk.length - 1; i >= 0; i--) {
    if (disk[i][0] !== '.') {
      for (let j = 0; j < rearrangedDisk.length && disk[i][0] !== rearrangedDisk[j][0]; j++) {
        const lengthDiff = rearrangedDisk[j].length - disk[i].length ;
        if (rearrangedDisk[j][0] === '.' && lengthDiff >= 0) {
          const indexInRearranged = rearrangedDisk.findIndex((file) => file[0] === disk[i][0]);
          rearrangedDisk[indexInRearranged] = rearrangedDisk[indexInRearranged].map(() => '.');
          rearrangedDisk.splice(j, 1, disk[i], ...(lengthDiff > 0 ? [rearrangedDisk[j].slice(0, lengthDiff)] : []));
          break;
        }
      }
    }
  }

  const checksum = rearrangedDisk
    .flat()
    .reduce((acc, value, index) =>  acc + (value === '.' ? 0 : value * index), 0);

  const result = checksum;

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

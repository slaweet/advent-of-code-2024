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
    .map((length, i) => Array(parseInt(length)).fill(`${i % 2 === 0 ? (i / 2) : '.'}`))
    .flat();
 
  const rearrangedDisk = [...disk];
  for (let i = 0; i < rearrangedDisk.length; i++) {
    while (rearrangedDisk[i] === '.' && i !== rearrangedDisk.length - 1) {
      rearrangedDisk[i] = rearrangedDisk.pop();
    }
  }

  const checksum = rearrangedDisk
    .filter((value) => value !== '.')
    .reduce((acc, value, index) =>  acc + value * index, 0);

  const result = checksum;

  console.log(result);
} catch(e) {
  console.error('Error:', e.stack);
  process.exit(1);
}

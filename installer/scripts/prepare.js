const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', '..', '.claude', 'commands');
const destDir = path.resolve(__dirname, '..', 'skills');

console.log(`Preparing package: copying skills from ${srcDir} to ${destDir}...`);

if (!fs.existsSync(srcDir)) {
  console.error(`Source directory ${srcDir} does not exist!`);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const skills = [
  'create-agent.md',
  'improve-agent.md',
  'extend-agent.md'
];

let copied = 0;
for (const skill of skills) {
  const src = path.join(srcDir, skill);
  const dest = path.join(destDir, skill);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`  Copied: ${skill}`);
    copied++;
  } else {
    console.warn(`  Warning: Skill not found at ${src}`);
  }
}

// Copy TEST_CONSTITUTION.md
const constSrc = path.resolve(__dirname, '..', '..', 'tests', 'TEST_CONSTITUTION.md');
const constDest = path.join(destDir, 'TEST_CONSTITUTION.md');
if (fs.existsSync(constSrc)) {
  fs.copyFileSync(constSrc, constDest);
  console.log(`  Copied: TEST_CONSTITUTION.md`);
} else {
  console.warn(`  Warning: TEST_CONSTITUTION.md not found at ${constSrc}`);
}

console.log(`Copied ${copied} skill files to installer package.\n`);

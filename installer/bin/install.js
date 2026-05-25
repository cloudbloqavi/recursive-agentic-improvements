#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Target directory defaults to current working directory, or can be specified as first argument
const args = process.argv.slice(2);
const targetProject = args[0] ? path.resolve(args[0]) : process.cwd();
const targetDir = path.join(targetProject, '.claude', 'commands');

const skills = [
  'create-agent.md',
  'improve-agent.md',
  'extend-agent.md'
];

// Determine source directory: check package skills/ first, then fall back to local dev location
let sourceDir = path.join(__dirname, '..', 'skills');
if (!fs.existsSync(sourceDir)) {
  const devSourceDir = path.resolve(__dirname, '..', '..', '.claude', 'commands');
  if (fs.existsSync(devSourceDir)) {
    sourceDir = devSourceDir;
  }
}

console.log('\nRecursive Agentic Improvement Skills — Installer');
console.log('=================================================');
console.log(`Source:  ${sourceDir}`);
console.log(`Target:  ${targetDir}\n`);

// Verify source skills directory exists
if (!fs.existsSync(sourceDir)) {
  console.error(`ERROR: Source skills directory not found. Please ensure the repository is correct.`);
  process.exit(1);
}

// Check target project directory exists
if (!fs.existsSync(targetProject)) {
  console.error(`ERROR: Target project directory not found: ${targetProject}`);
  process.exit(1);
}

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  try {
    fs.mkdirSync(targetDir, { recursive: true });
  } catch (err) {
    console.error(`ERROR: Failed to create target directory ${targetDir}:`, err.message);
    process.exit(1);
  }
}

let installedCount = 0;

for (const skill of skills) {
  const srcPath = path.join(sourceDir, skill);
  const dstPath = path.join(targetDir, skill);

  if (!fs.existsSync(srcPath)) {
    console.warn(`WARNING: Skill not found, skipping: ${skill}`);
    continue;
  }

  const isUpdate = fs.existsSync(dstPath);
  if (isUpdate) {
    console.log(`  [UPDATE] ${skill}`);
  } else {
    console.log(`  [NEW]    ${skill}`);
  }

  try {
    fs.copyFileSync(srcPath, dstPath);
    installedCount++;
  } catch (err) {
    console.error(`ERROR: Failed to copy ${skill}:`, err.message);
  }
}

// Copy TEST_CONSTITUTION.md to target project
const constSrcPath = path.join(sourceDir, 'TEST_CONSTITUTION.md');
if (fs.existsSync(constSrcPath)) {
  let testsDirName = 'tests';
  if (fs.existsSync(path.join(targetProject, 'test')) && !fs.existsSync(path.join(targetProject, 'tests'))) {
    testsDirName = 'test';
  }
  const targetTestsDir = path.join(targetProject, testsDirName);
  const constDstPath = path.join(targetTestsDir, 'TEST_CONSTITUTION.md');

  if (!fs.existsSync(targetTestsDir)) {
    try {
      fs.mkdirSync(targetTestsDir, { recursive: true });
    } catch (err) {
      console.warn(`WARNING: Failed to create tests directory ${targetTestsDir}:`, err.message);
    }
  }

  if (fs.existsSync(targetTestsDir)) {
    const isConstUpdate = fs.existsSync(constDstPath);
    if (isConstUpdate) {
      console.log(`  [UPDATE] TEST_CONSTITUTION.md`);
    } else {
      console.log(`  [NEW]    TEST_CONSTITUTION.md`);
    }
    try {
      fs.copyFileSync(constSrcPath, constDstPath);
      console.log(`           copied to ${testsDirName}/TEST_CONSTITUTION.md`);
    } catch (err) {
      console.error(`ERROR: Failed to copy TEST_CONSTITUTION.md:`, err.message);
    }
  }
}

console.log(`\nInstalled ${installedCount} skill(s) to ${targetDir}\n`);
console.log(`Usage in Claude Code (inside ${targetProject}):`);
console.log('  /create-agent agno chatbot');
console.log('  /improve-agent');
console.log('  /extend-agent langgraph react-agent\n');
console.log('Run /create-agent, /improve-agent, or /extend-agent for interactive prompting.\n');


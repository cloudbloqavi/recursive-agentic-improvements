#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// ---------------------------------------------------------------------------
// CLI arg parsing
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
let agentArg = null;
let targetProject = process.cwd();

for (let i = 0; i < args.length; i++) {
  if ((args[i] === '--agent' || args[i] === '-a') && args[i + 1]) {
    agentArg = args[i + 1].toLowerCase();
    i++;
  } else if (args[i] === '--help' || args[i] === '-h') {
    console.log(`
Usage: npx github:cloudbloqavi/recursive-agentic-improvements [target-dir] [--agent <name>]

Options:
  --agent, -a   Target agentic AI environment (omit for interactive multi-select)
  --help, -h    Show this help message

Supported agents:
  claude        Claude Code      →  .claude/commands/       (default)
  cursor        Cursor           →  .cursor/rules/
  copilot       GitHub Copilot   →  .github/instructions/
  roo           Roo Code         →  .roo/rules/
  windsurf      Windsurf         →  .windsurf/rules/
  codex         OpenAI Codex     →  . (project root)
  antigravity   Google Antigravity → .agents/rules/
  other         Custom / Other   →  .coding/

Examples:
  npx github:cloudbloqavi/recursive-agentic-improvements
  npx github:cloudbloqavi/recursive-agentic-improvements --agent cursor
  npx github:cloudbloqavi/recursive-agentic-improvements /path/to/project --agent copilot
`);
    process.exit(0);
  } else if (!args[i].startsWith('-')) {
    targetProject = path.resolve(args[i]);
  }
}

// ---------------------------------------------------------------------------
// Agent configurations
// ---------------------------------------------------------------------------
const AGENTS = {
  claude: {
    label: 'Claude Code',
    dir: path.join('.claude', 'commands'),
    ext: '.md',
  },
  cursor: {
    label: 'Cursor',
    dir: path.join('.cursor', 'rules'),
    ext: '.mdc',
    frontmatter: true,
  },
  copilot: {
    label: 'GitHub Copilot',
    dir: path.join('.github', 'instructions'),
    ext: '.md',
  },
  roo: {
    label: 'Roo Code',
    dir: path.join('.roo', 'rules'),
    ext: '.md',
  },
  windsurf: {
    label: 'Windsurf',
    dir: path.join('.windsurf', 'rules'),
    ext: '.md',
  },
  codex: {
    label: 'OpenAI Codex',
    dir: '.',
    ext: '.md',
  },
  antigravity: {
    label: 'Google Antigravity',
    dir: path.join('.agents', 'rules'),
    ext: '.md',
  },
  other: {
    label: 'Other / Custom',
    dir: '.coding',
    ext: '.md',
    isOther: true,
  },
};

const MENU_ORDER = ['claude', 'cursor', 'copilot', 'roo', 'windsurf', 'codex', 'antigravity', 'other'];

// ---------------------------------------------------------------------------
// Cursor .mdc frontmatter helper
// ---------------------------------------------------------------------------
function wrapWithFrontmatter(content, skillName) {
  const firstLine = content.split('\n').find(l => l.trim());
  const description = firstLine ? firstLine.replace(/^#+\s*/, '').trim() : skillName;
  return `---\ndescription: ${description}\nglobs: \nalwaysApply: false\n---\n\n${content}`;
}

// ---------------------------------------------------------------------------
// Source resolution: package skills/ → dev fallback .claude/commands/
// ---------------------------------------------------------------------------
function resolveSourceDir() {
  let sourceDir = path.join(__dirname, '..', 'skills');
  if (!fs.existsSync(sourceDir)) {
    const devSourceDir = path.resolve(__dirname, '..', '..', '.claude', 'commands');
    if (fs.existsSync(devSourceDir)) sourceDir = devSourceDir;
  }
  return sourceDir;
}

// ---------------------------------------------------------------------------
// Install skills for a single agent key
// ---------------------------------------------------------------------------
const SKILLS = ['create-agent.md', 'improve-agent.md', 'extend-agent.md'];

const USAGE_HINTS = {
  claude:      `Usage in Claude Code:\n  /create-agent agno chatbot\n  /improve-agent\n  /extend-agent langgraph react-agent`,
  cursor:      `Rules are now active in Cursor for this project.\nOpen Cursor Settings → Rules to verify.`,
  copilot:     `Instructions added to .github/instructions/.\nGitHub Copilot will pick these up automatically.`,
  roo:         `Rules installed for Roo Code.\nThey apply automatically to this project.`,
  windsurf:    `Rules installed for Windsurf.\nThey apply automatically to this project.`,
  codex:       `Skill files installed at project root.\nReference them in your AGENTS.md or pass them as context to Codex.`,
  antigravity: `Rules installed for Google Antigravity.\nThey are active in the Agent Manager under .agents/rules/.`,
  other:       `Skills installed to .coding/\n→ Rename the ".coding" folder to match your tool's expected directory (e.g. ".myagent/rules").`,
};

function installForAgent(agentKey, sourceDir) {
  const agent = AGENTS[agentKey];
  const targetDir = path.join(targetProject, agent.dir);

  console.log(`\n── ${agent.label} ──`);
  console.log(`   Target: ${targetDir}`);

  if (!fs.existsSync(targetDir)) {
    try {
      fs.mkdirSync(targetDir, { recursive: true });
    } catch (err) {
      console.error(`   ERROR: Failed to create ${targetDir}: ${err.message}`);
      return 0;
    }
  }

  let count = 0;
  for (const skill of SKILLS) {
    const srcPath = path.join(sourceDir, skill);
    if (!fs.existsSync(srcPath)) {
      console.warn(`   WARNING: Skill not found, skipping: ${skill}`);
      continue;
    }
    const baseName = path.basename(skill, '.md');
    const destFile = baseName + agent.ext;
    const dstPath = path.join(targetDir, destFile);
    const isUpdate = fs.existsSync(dstPath);
    console.log(`   [${isUpdate ? 'UPDATE' : 'NEW   '}] ${destFile}`);
    try {
      let content = fs.readFileSync(srcPath, 'utf8');
      if (agent.frontmatter) content = wrapWithFrontmatter(content, baseName);
      fs.writeFileSync(dstPath, content, 'utf8');
      count++;
    } catch (err) {
      console.error(`   ERROR: Failed to install ${skill}: ${err.message}`);
    }
  }

  // TEST_CONSTITUTION.md
  const constSrcPath = path.join(sourceDir, 'TEST_CONSTITUTION.md');
  if (fs.existsSync(constSrcPath) && agentKey !== 'codex') {
    const testsDirName =
      fs.existsSync(path.join(targetProject, 'test')) && !fs.existsSync(path.join(targetProject, 'tests'))
        ? 'test' : 'tests';
    const targetTestsDir = path.join(targetProject, testsDirName);
    const constDstPath = path.join(targetTestsDir, 'TEST_CONSTITUTION.md');
    if (!fs.existsSync(targetTestsDir)) {
      try { fs.mkdirSync(targetTestsDir, { recursive: true }); } catch (_) {}
    }
    if (fs.existsSync(targetTestsDir)) {
      const isUpdate = fs.existsSync(constDstPath);
      console.log(`   [${isUpdate ? 'UPDATE' : 'NEW   '}] TEST_CONSTITUTION.md → ${testsDirName}/`);
      try { fs.copyFileSync(constSrcPath, constDstPath); } catch (err) {
        console.error(`   ERROR: Failed to copy TEST_CONSTITUTION.md: ${err.message}`);
      }
    }
  }

  console.log(`   Installed ${count} skill(s).`);
  console.log(`   ${USAGE_HINTS[agentKey]}`);
  return count;
}

// ---------------------------------------------------------------------------
// Interactive multi-select prompt
// ---------------------------------------------------------------------------
function runInteractivePrompt() {
  return new Promise((resolve) => {
    const selected = new Set();
    let cursor = 0;

    function render() {
      // Move cursor up to overwrite previous render (after first draw)
      process.stdout.write('\x1B[2J\x1B[0f'); // clear screen
      console.log('Recursive Agentic Improvement Skills — Installer');
      console.log('=================================================');
      console.log('Select target environments (Space to toggle, Enter to confirm, a to toggle all):\n');
      MENU_ORDER.forEach((key, i) => {
        const agent = AGENTS[key];
        const check = selected.has(key) ? '●' : '○';
        const arrow = i === cursor ? '▶' : ' ';
        const label = `${agent.label}`.padEnd(22);
        const dir = key === 'other' ? '.coding/' : agent.dir + '/';
        console.log(`  ${arrow} ${check}  ${label}  ${dir}`);
      });
      console.log('\n  [Space] toggle  [↑↓] move  [a] toggle all  [Enter] confirm  [Ctrl+C] cancel');
    }

    render();

    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) process.stdin.setRawMode(true);

    process.stdin.on('keypress', (ch, key) => {
      if (!key) return;

      if (key.name === 'up' || key.name === 'k') {
        cursor = (cursor - 1 + MENU_ORDER.length) % MENU_ORDER.length;
      } else if (key.name === 'down' || key.name === 'j') {
        cursor = (cursor + 1) % MENU_ORDER.length;
      } else if (key.name === 'space') {
        const k = MENU_ORDER[cursor];
        if (selected.has(k)) selected.delete(k); else selected.add(k);
      } else if (ch === 'a') {
        if (selected.size === MENU_ORDER.length) {
          selected.clear();
        } else {
          MENU_ORDER.forEach(k => selected.add(k));
        }
      } else if (key.name === 'return') {
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        process.stdin.pause();
        resolve([...selected]);
        return;
      } else if (key.ctrl && key.name === 'c') {
        if (process.stdin.isTTY) process.stdin.setRawMode(false);
        process.stdin.pause();
        console.log('\nCancelled.');
        process.exit(0);
      }

      render();
    });
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const sourceDir = resolveSourceDir();

  if (!fs.existsSync(sourceDir)) {
    console.error(`ERROR: Source skills directory not found.`);
    process.exit(1);
  }

  if (!fs.existsSync(targetProject)) {
    console.error(`ERROR: Target project directory not found: ${targetProject}`);
    process.exit(1);
  }

  let selectedKeys;

  if (agentArg) {
    // Legacy single-agent flag
    if (!AGENTS[agentArg]) {
      const supported = Object.keys(AGENTS).join(', ');
      console.error(`\nERROR: Unknown agent "${agentArg}". Supported: ${supported}\n`);
      process.exit(1);
    }
    selectedKeys = [agentArg];
  } else if (!process.stdin.isTTY) {
    // Non-interactive (piped/CI): default to claude
    console.log('Non-interactive mode detected — defaulting to Claude Code.');
    selectedKeys = ['claude'];
  } else {
    selectedKeys = await runInteractivePrompt();
    if (selectedKeys.length === 0) {
      console.log('\nNo environments selected. Nothing installed.\n');
      process.exit(0);
    }
  }

  console.log(`\nRecursive Agentic Improvement Skills — Installer`);
  console.log(`=================================================`);
  console.log(`Source:  ${sourceDir}`);
  console.log(`Project: ${targetProject}`);

  for (const key of selectedKeys) {
    installForAgent(key, sourceDir);
  }

  console.log('\n✓ Done.\n');

  if (selectedKeys.includes('other')) {
    console.log('NOTE: Skills were installed to ".coding/".');
    console.log('      Rename that folder to match your tool\'s expected directory, e.g.:');
    console.log('        mv .coding .myagent/rules\n');
  }
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});

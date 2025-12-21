#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  try {
    log(`\n${description}...`, 'blue');
    const output = execSync(command, { stdio: 'inherit', encoding: 'utf8' });
    log(`✓ ${description} completed successfully`, 'green');
    return output;
  } catch (error) {
    log(`✗ ${description} failed`, 'red');
    log(`Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

function getPackageVersion() {
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  return packageJson.version;
}

function main() {
  const args = process.argv.slice(2);
  const versionType = args[0] || 'patch'; // patch, minor, major
  
  if (!['patch', 'minor', 'major'].includes(versionType)) {
    log('Usage: npm run publish [patch|minor|major]', 'yellow');
    log('Default: patch', 'yellow');
    process.exit(1);
  }

  const currentVersion = getPackageVersion();
  
  log('Starting publication process...', 'magenta');
  log(`Current version: ${currentVersion}`, 'cyan');
  log(`Version bump type: ${versionType}`, 'cyan');

  // Step 1: Run tests
  execCommand('npm test', 'Running unit tests');

  // Step 2: Build the project
  execCommand('npm run build', 'Building project');

  // Step 3: Version bump
  execCommand(`npm version ${versionType}`, `Bumping ${versionType} version`);

  const newVersion = getPackageVersion();
  log(`New version: ${newVersion}`, 'green');

  // Step 4: Publish to npm
  execCommand('npm publish --ignore-scripts', 'Publishing to npm');

  // Step 5: Git push with tags
  execCommand('git push --follow-tags', 'Pushing to git with tags');

  log('\nPublication completed successfully!', 'green');
  log(`Package @dspackages/highlight-text@${newVersion} is now available on npm`, 'cyan');
}

if (require.main === module) {
  main();
}

module.exports = { main };
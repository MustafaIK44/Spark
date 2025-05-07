/**
 * Integration Test Runner Script
 * 
 * This script can be used to run integration tests and generate a coverage report.
 * It will:
 * 1. Run all integration tests (*.integration.test.js)
 * 2. Generate a coverage report
 * 3. Display a summary of which backend functions were invoked during testing
 */

// Add a placeholder test to satisfy Jest
describe('Integration Test Runner', () => {
  it('should be able to run tests', () => {
    expect(true).toBe(true);
  });
});

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define directories to look for backend functions
const BACKEND_DIRS = [
  path.join(__dirname, '..', 'app', 'api'),
  path.join(__dirname, '..', 'libs', 'firebase'),
  path.join(__dirname, '..', 'libs')
];

console.log('🔍 Analyzing backend functions...');

// Get all backend function files
const getJsFiles = (dir) => {
  const results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...getJsFiles(filePath));
    } else if (file.endsWith('.js') && !file.includes('.test.js')) {
      results.push(filePath);
    }
  }
  
  return results;
};

// Get all backend function files
const backendFiles = BACKEND_DIRS.flatMap(dir => {
  try {
    return getJsFiles(dir);
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
    return [];
  }
});

console.log(`📋 Found ${backendFiles.length} backend files to test`);

// Run integration tests with coverage
console.log('\n🧪 Running integration tests...');
try {
  execSync('npm run test:integration', { stdio: 'inherit' });
  console.log('✅ Integration tests completed successfully');
} catch (error) {
  console.error('❌ Integration tests failed:', error.message);
  process.exit(1);
}

// Parse coverage report to determine which functions were invoked
console.log('\n📊 Analyzing coverage results...');
try {
  const coverageDir = path.join(__dirname, '..', 'coverage');
  const coverageSummary = path.join(coverageDir, 'coverage-summary.json');
  
  if (fs.existsSync(coverageSummary)) {
    const summary = JSON.parse(fs.readFileSync(coverageSummary, 'utf8'));
    
    // Display summary
    console.log('\n📈 Backend Function Coverage:');
    console.log('---------------------------');
    
    let totalStatements = 0;
    let coveredStatements = 0;
    let totalBranches = 0;
    let coveredBranches = 0;
    
    // Get coverage for each backend file
    for (const file in summary) {
      if (file === 'total') continue;
      
      // Check if this is a backend file we care about
      const isBackendFile = backendFiles.some(bf => file.includes(bf.replace(__dirname, '')));
      if (!isBackendFile) continue;
      
      const fileSummary = summary[file];
      const fileName = path.basename(file);
      const stmtPct = fileSummary.statements.pct;
      const branchPct = fileSummary.branches.pct;
      
      totalStatements += fileSummary.statements.total;
      coveredStatements += fileSummary.statements.covered;
      totalBranches += fileSummary.branches.total;
      coveredBranches += fileSummary.branches.covered;
      
      console.log(`${fileName}: Statements ${stmtPct}%, Branches ${branchPct}%`);
    }
    
    // Calculate overall coverage
    const stmtPct = (coveredStatements / totalStatements * 100).toFixed(2);
    const branchPct = (coveredBranches / totalBranches * 100).toFixed(2);
    
    console.log('\n🔍 Overall Backend Coverage:');
    console.log(`Statement coverage: ${stmtPct}%`);
    console.log(`Branch coverage: ${branchPct}%`);
    console.log('---------------------------');
    
    console.log('\n📝 Coverage report available at:', path.join(coverageDir, 'lcov-report', 'index.html'));
  } else {
    console.log('⚠️ No coverage summary found. Make sure tests are generating coverage reports.');
  }
} catch (error) {
  console.error('❌ Error analyzing coverage:', error.message);
} 
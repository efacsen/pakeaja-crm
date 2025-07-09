const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test suites configuration
const testSuites = [
  {
    name: 'Authentication',
    file: 'auth.spec.ts',
    description: 'User login, logout, and session management'
  },
  {
    name: 'Customer Management',
    file: 'customers.spec.ts',
    description: 'Create, edit, search, and view customers'
  },
  {
    name: 'Daily Reports',
    file: 'daily-reports.spec.ts',
    description: 'Submit and view daily reports (Admin/Manager)'
  },
  {
    name: 'Calculator',
    file: 'calculator.spec.ts',
    description: 'Coating calculations and estimates'
  },
  {
    name: 'Sales Pipeline',
    file: 'pipeline.spec.ts',
    description: 'Lead management and pipeline stages'
  }
];

// Function to run a single test suite
async function runTestSuite(suite) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const testProcess = spawn('npx', [
      'playwright',
      'test',
      `tests/e2e/${suite.file}`,
      '--reporter=json'
    ], {
      shell: true,
      stdio: 'pipe'
    });

    let output = '';
    let jsonOutput = '';

    testProcess.stdout.on('data', (data) => {
      output += data.toString();
      // Capture JSON output
      const str = data.toString();
      if (str.includes('{') || jsonOutput) {
        jsonOutput += str;
      }
    });

    testProcess.stderr.on('data', (data) => {
      output += data.toString();
    });

    testProcess.on('close', (code) => {
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);

      // Try to parse JSON output
      let testResults = null;
      try {
        // Extract JSON from output
        const jsonMatch = jsonOutput.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          testResults = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        // If JSON parsing fails, create a basic result
      }

      resolve({
        suite: suite.name,
        description: suite.description,
        passed: code === 0,
        duration: `${duration}s`,
        timestamp: new Date().toISOString(),
        details: testResults || {
          total: 0,
          passed: 0,
          failed: code === 0 ? 0 : 1,
          skipped: 0
        },
        output: output.substring(0, 1000) // First 1000 chars
      });
    });
  });
}

// Function to generate HTML dashboard
function generateHTMLDashboard(results) {
  const totalTests = results.reduce((sum, r) => sum + (r.details.total || 0), 0);
  const passedTests = results.reduce((sum, r) => sum + (r.details.passed || 0), 0);
  const failedTests = results.reduce((sum, r) => sum + (r.details.failed || 0), 0);
  const passRate = totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PakeAja CRM - Test Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        header {
            text-align: center;
            margin-bottom: 3rem;
        }
        
        h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            background: linear-gradient(to right, #60a5fa, #a78bfa);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .subtitle {
            color: #94a3b8;
            font-size: 1.1rem;
        }
        
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        
        .summary-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 1.5rem;
            text-align: center;
        }
        
        .summary-card h3 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }
        
        .summary-card.success h3 { color: #4ade80; }
        .summary-card.error h3 { color: #f87171; }
        .summary-card.info h3 { color: #60a5fa; }
        
        .test-results {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            overflow: hidden;
        }
        
        .test-suite {
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: background 0.2s;
        }
        
        .test-suite:last-child {
            border-bottom: none;
        }
        
        .test-suite:hover {
            background: rgba(255, 255, 255, 0.05);
        }
        
        .test-header {
            padding: 1.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }
        
        .test-info h3 {
            font-size: 1.25rem;
            margin-bottom: 0.25rem;
            color: #f1f5f9;
        }
        
        .test-info p {
            color: #94a3b8;
            font-size: 0.9rem;
        }
        
        .test-status {
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        
        .status-badge {
            padding: 0.5rem 1rem;
            border-radius: 9999px;
            font-weight: 600;
            font-size: 0.875rem;
            text-transform: uppercase;
        }
        
        .status-badge.passed {
            background: rgba(74, 222, 128, 0.2);
            color: #4ade80;
        }
        
        .status-badge.failed {
            background: rgba(248, 113, 113, 0.2);
            color: #f87171;
        }
        
        .test-duration {
            color: #64748b;
            font-size: 0.875rem;
        }
        
        .test-details {
            padding: 0 1.5rem 1.5rem;
            display: none;
        }
        
        .test-details.show {
            display: block;
        }
        
        .test-stats {
            display: flex;
            gap: 2rem;
            margin-bottom: 1rem;
        }
        
        .test-stat {
            font-size: 0.875rem;
        }
        
        .test-stat span {
            font-weight: 600;
            margin-left: 0.25rem;
        }
        
        .test-output {
            background: #1e293b;
            border-radius: 8px;
            padding: 1rem;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            max-height: 200px;
            overflow-y: auto;
            white-space: pre-wrap;
            word-break: break-word;
        }
        
        .timestamp {
            text-align: center;
            color: #64748b;
            margin-top: 3rem;
            font-size: 0.875rem;
        }
        
        .user-journey {
            background: rgba(96, 165, 250, 0.1);
            border-left: 3px solid #60a5fa;
            padding: 0.75rem 1rem;
            margin: 0.5rem 0;
            border-radius: 4px;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>PakeAja CRM Test Dashboard</h1>
            <p class="subtitle">Automated E2E Test Results</p>
        </header>
        
        <div class="summary">
            <div class="summary-card success">
                <h3>${passedTests}</h3>
                <p>Tests Passed</p>
            </div>
            <div class="summary-card error">
                <h3>${failedTests}</h3>
                <p>Tests Failed</p>
            </div>
            <div class="summary-card info">
                <h3>${passRate}%</h3>
                <p>Pass Rate</p>
            </div>
        </div>
        
        <div class="test-results">
            ${results.map((result, index) => `
                <div class="test-suite">
                    <div class="test-header" onclick="toggleDetails(${index})">
                        <div class="test-info">
                            <h3>${result.suite}</h3>
                            <p>${result.description}</p>
                        </div>
                        <div class="test-status">
                            <span class="status-badge ${result.passed ? 'passed' : 'failed'}">
                                ${result.passed ? 'Passed' : 'Failed'}
                            </span>
                            <span class="test-duration">${result.duration}</span>
                        </div>
                    </div>
                    <div class="test-details" id="details-${index}">
                        <div class="test-stats">
                            <div class="test-stat">Total:<span>${result.details.total || 0}</span></div>
                            <div class="test-stat">Passed:<span>${result.details.passed || 0}</span></div>
                            <div class="test-stat">Failed:<span>${result.details.failed || 0}</span></div>
                            <div class="test-stat">Skipped:<span>${result.details.skipped || 0}</span></div>
                        </div>
                        ${getUserJourneys(result.suite)}
                        <div class="test-output">
                            ${result.output || 'No output available'}
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <p class="timestamp">Last updated: ${new Date().toLocaleString()}</p>
    </div>
    
    <script>
        function toggleDetails(index) {
            const details = document.getElementById('details-' + index);
            details.classList.toggle('show');
        }
    </script>
</body>
</html>
  `;

  return html;
}

function getUserJourneys(suiteName) {
  const journeys = {
    'Authentication': [
      'User can login with valid credentials',
      'User sees appropriate menu based on role',
      'User can logout successfully'
    ],
    'Customer Management': [
      'Sales user creates new customer with company',
      'Sales user edits existing customer',
      'Sales user searches and filters customers'
    ],
    'Daily Reports': [
      'Manager submits daily report',
      'Admin views team reports',
      'Manager filters reports by date'
    ],
    'Calculator': [
      'Sales user calculates coating for new project',
      'Sales user saves calculation',
      'Manager reviews saved calculations'
    ],
    'Sales Pipeline': [
      'Sales user creates new lead',
      'Sales user moves lead through pipeline stages',
      'Manager views team pipeline'
    ]
  };

  const suiteJourneys = journeys[suiteName] || [];
  return suiteJourneys.map(journey => 
    `<div class="user-journey">📍 ${journey}</div>`
  ).join('');
}

// Main execution
async function main() {
  console.log('🚀 Starting PakeAja CRM Test Suite...\n');
  
  const results = [];
  
  for (const suite of testSuites) {
    console.log(`Running ${suite.name} tests...`);
    const result = await runTestSuite(suite);
    results.push(result);
    console.log(`${result.passed ? '✅' : '❌'} ${suite.name} - ${result.duration}\n`);
  }
  
  // Generate HTML dashboard
  const dashboardHTML = generateHTMLDashboard(results);
  const dashboardPath = path.join(__dirname, 'test-dashboard.html');
  fs.writeFileSync(dashboardPath, dashboardHTML);
  
  console.log(`\n📊 Test Dashboard generated: ${dashboardPath}`);
  console.log('\nOpen the dashboard in your browser to view detailed results.');
  
  // Exit with appropriate code
  const hasFailures = results.some(r => !r.passed);
  process.exit(hasFailures ? 1 : 0);
}

// Run tests
main().catch(console.error);
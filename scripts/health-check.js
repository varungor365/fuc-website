#!/usr/bin/env node

/**
 * FASHUN.CO Platform - Installation & Health Check Script
 * This script checks system requirements and guides through installation
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

function colorize(color, text) {
    return `${colors[color]}${text}${colors.reset}`;
}

function log(level, message) {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = {
        info: colorize('blue', '[INFO]'),
        success: colorize('green', '[SUCCESS]'),
        warning: colorize('yellow', '[WARNING]'),
        error: colorize('red', '[ERROR]'),
        debug: colorize('cyan', '[DEBUG]')
    };
    console.log(`${prefix[level]} ${timestamp} ${message}`);
}

function checkSystemRequirements() {
    log('info', 'Checking system requirements...');
    
    const requirements = {
        node: { required: '18.0.0', current: null, satisfied: false },
        npm: { required: '8.0.0', current: null, satisfied: false },
        python: { required: '3.8.0', current: null, satisfied: false, optional: true },
        git: { required: '2.0.0', current: null, satisfied: false, optional: true }
    };
    
    // Check Node.js
    try {
        const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim().substring(1);
        requirements.node.current = nodeVersion;
        requirements.node.satisfied = compareVersions(nodeVersion, requirements.node.required) >= 0;
        log(requirements.node.satisfied ? 'success' : 'error', 
            `Node.js: ${nodeVersion} (required: >=${requirements.node.required})`);
    } catch (error) {
        log('error', 'Node.js not found. Please install Node.js 18+ from https://nodejs.org');
        requirements.node.satisfied = false;
    }
    
    // Check npm
    try {
        const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
        requirements.npm.current = npmVersion;
        requirements.npm.satisfied = compareVersions(npmVersion, requirements.npm.required) >= 0;
        log(requirements.npm.satisfied ? 'success' : 'error', 
            `npm: ${npmVersion} (required: >=${requirements.npm.required})`);
    } catch (error) {
        log('error', 'npm not found');
        requirements.npm.satisfied = false;
    }
    
    // Check Python (optional)
    try {
        const pythonVersion = execSync('python --version', { encoding: 'utf-8' }).trim().split(' ')[1];
        requirements.python.current = pythonVersion;
        requirements.python.satisfied = compareVersions(pythonVersion, requirements.python.required) >= 0;
        log(requirements.python.satisfied ? 'success' : 'warning',
            `Python: ${pythonVersion} (recommended for native dependencies)`);
    } catch (error) {
        log('warning', 'Python not found (optional, but recommended for native dependencies)');
    }
    
    // Check Git (optional)
    try {
        const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim().split(' ')[2];
        requirements.git.current = gitVersion;
        requirements.git.satisfied = true;
        log('success', `Git: ${gitVersion}`);
    } catch (error) {
        log('warning', 'Git not found (optional)');
    }
    
    return requirements;
}

function compareVersions(version1, version2) {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
        const v1part = v1parts[i] || 0;
        const v2part = v2parts[i] || 0;
        
        if (v1part > v2part) return 1;
        if (v1part < v2part) return -1;
    }
    return 0;
}

function checkProjectStructure() {
    log('info', 'Checking project structure...');
    
    const requiredDirs = [
        'fashun-store',
        'fashun-backend', 
        'ai-mockup-service'
    ];
    
    const structure = {
        valid: true,
        services: {}
    };
    
    for (const dir of requiredDirs) {
        const dirPath = path.join(process.cwd(), dir);
        const packageJsonPath = path.join(dirPath, 'package.json');
        const nodeModulesPath = path.join(dirPath, 'node_modules');
        
        structure.services[dir] = {
            exists: fs.existsSync(dirPath),
            hasPackageJson: fs.existsSync(packageJsonPath),
            hasDependencies: fs.existsSync(nodeModulesPath),
            packageJson: null
        };
        
        if (structure.services[dir].exists && structure.services[dir].hasPackageJson) {
            try {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
                structure.services[dir].packageJson = packageJson;
                log('success', `Found ${dir}: ${packageJson.name} v${packageJson.version}`);
                
                if (structure.services[dir].hasDependencies) {
                    const nodeModulesCount = fs.readdirSync(nodeModulesPath).length;
                    log('success', `  Dependencies installed: ${nodeModulesCount} packages`);
                } else {
                    log('warning', `  Dependencies not installed`);
                }
            } catch (error) {
                log('error', `Invalid package.json in ${dir}`);
                structure.valid = false;
            }
        } else {
            log('error', `Missing required directory or package.json: ${dir}`);
            structure.valid = false;
        }
    }
    
    return structure;
}

function installDependencies(service) {
    return new Promise((resolve, reject) => {
        log('info', `Installing dependencies for ${service}...`);
        
        const servicePath = path.join(process.cwd(), service);
        const npmInstall = spawn('npm', ['install'], {
            cwd: servicePath,
            stdio: 'inherit',
            shell: true
        });
        
        npmInstall.on('close', (code) => {
            if (code === 0) {
                log('success', `Dependencies installed for ${service}`);
                resolve();
            } else {
                log('error', `Failed to install dependencies for ${service} (exit code: ${code})`);
                reject(new Error(`npm install failed for ${service}`));
            }
        });
        
        npmInstall.on('error', (error) => {
            log('error', `Error installing dependencies for ${service}: ${error.message}`);
            reject(error);
        });
    });
}

function generateInstallationReport(requirements, structure) {
    const report = {
        timestamp: new Date().toISOString(),
        system: {
            platform: os.platform(),
            arch: os.arch(),
            nodeVersion: requirements.node.current,
            npmVersion: requirements.npm.current
        },
        requirements: requirements,
        structure: structure,
        recommendations: []
    };
    
    // Generate recommendations
    if (!requirements.node.satisfied) {
        report.recommendations.push('Install Node.js 18+ from https://nodejs.org');
    }
    
    if (!requirements.npm.satisfied) {
        report.recommendations.push('Update npm: npm install -g npm@latest');
    }
    
    if (!requirements.python.satisfied) {
        report.recommendations.push('Install Python 3.8+ from https://python.org (recommended for native dependencies)');
    }
    
    for (const [service, info] of Object.entries(structure.services)) {
        if (!info.hasDependencies) {
            report.recommendations.push(`Install ${service} dependencies: cd ${service} && npm install`);
        }
    }
    
    return report;
}

async function main() {
    console.log(colorize('bright', '\n🚀 FASHUN.CO Platform - Installation & Health Check\n'));
    console.log('=' .repeat(60));
    
    try {
        // Check system requirements
        const requirements = checkSystemRequirements();
        
        // Check project structure
        const structure = checkProjectStructure();
        
        // Generate report
        const report = generateInstallationReport(requirements, structure);
        
        console.log('\n' + colorize('bright', '📊 INSTALLATION REPORT'));
        console.log('=' .repeat(30));
        
        // System status
        const systemReady = requirements.node.satisfied && requirements.npm.satisfied;
        log(systemReady ? 'success' : 'error', `System Requirements: ${systemReady ? 'SATISFIED' : 'NOT SATISFIED'}`);
        
        // Project status
        const projectReady = structure.valid;
        log(projectReady ? 'success' : 'error', `Project Structure: ${projectReady ? 'VALID' : 'INVALID'}`);
        
        // Dependencies status
        const depsInstalled = Object.values(structure.services).every(s => s.hasDependencies);
        log(depsInstalled ? 'success' : 'warning', `Dependencies: ${depsInstalled ? 'INSTALLED' : 'MISSING'}`);
        
        // Recommendations
        if (report.recommendations.length > 0) {
            console.log('\n' + colorize('bright', '💡 RECOMMENDATIONS'));
            console.log('=' .repeat(20));
            report.recommendations.forEach((rec, i) => {
                console.log(`${i + 1}. ${rec}`);
            });
        }
        
        // Installation options
        if (systemReady && projectReady && !depsInstalled) {
            console.log('\n' + colorize('bright', '⚡ QUICK ACTIONS'));
            console.log('=' .repeat(18));
            console.log('1. Install all dependencies: npm run install-all');
            console.log('2. Use PowerShell script: .\\install-dependencies.ps1');
            console.log('3. Manual installation: cd [service] && npm install');
        }
        
        // Save report
        const reportPath = path.join(process.cwd(), 'installation-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
        log('info', `Detailed report saved to: ${reportPath}`);
        
        // Exit with appropriate code
        const overallSuccess = systemReady && projectReady;
        if (overallSuccess) {
            console.log('\n' + colorize('green', '✅ System is ready for FASHUN.CO platform development!'));
            process.exit(0);
        } else {
            console.log('\n' + colorize('red', '❌ Please resolve the issues above before proceeding.'));
            process.exit(1);
        }
        
    } catch (error) {
        log('error', `Installation check failed: ${error.message}`);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = {
    checkSystemRequirements,
    checkProjectStructure,
    installDependencies,
    generateInstallationReport
};
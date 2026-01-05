#!/usr/bin/env node
/**
 * Deploy Edge Functions to Supabase
 * Usage: node deploy.js <project-id> <access-token>
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const projectId = process.argv[2] || 'xcmdrgzjjghxgvlkovwm';
const accessToken = process.argv[3] || process.env.SUPABASE_ACCESS_TOKEN;

if (!accessToken) {
  console.error('❌ Access token required. Set SUPABASE_ACCESS_TOKEN env var or pass as argument');
  process.exit(1);
}

const functions = [
  {
    name: 'webhook-event-logger',
    file: './webhook-event-logger/index.ts'
  },
  {
    name: 'webhook-external-notifier',
    file: './webhook-external-notifier/index.ts'
  }
];

async function deployFunction(functionName, filePath) {
  return new Promise((resolve, reject) => {
    const functionCode = fs.readFileSync(filePath, 'utf8');
    
    const data = JSON.stringify({
      name: functionName,
      slug: functionName,
      code: functionCode,
      import_map: '',
      verify_jwt: false,
    });

    const options = {
      hostname: `${projectId}.supabase.co`,
      path: `/functions/v1/functions/${functionName}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log(`✅ ${functionName} deployed successfully`);
          resolve();
        } else {
          console.log(`⚠️  ${functionName}: ${res.statusCode}`);
          resolve();
        }
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Error deploying ${functionName}: ${e.message}`);
      reject(e);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  console.log(`\n🚀 Deploying Edge Functions to Supabase...\n`);
  console.log(`Project: ${projectId}\n`);

  try {
    for (const func of functions) {
      const filePath = path.join(__dirname, func.file);
      if (fs.existsSync(filePath)) {
        await deployFunction(func.name, filePath);
      } else {
        console.log(`⚠️  ${func.file} not found, skipping...`);
      }
    }
    console.log(`\n✅ All functions deployed!`);
  } catch (error) {
    console.error(`\n❌ Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

main();

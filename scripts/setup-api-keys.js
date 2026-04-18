#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = path.join(__dirname, '..', 'backend', '.env');

console.log('\n🔑 NationChain API Keys Setup\n');
console.log('This script will help you configure API keys for real-world news integration.\n');
console.log('📖 See docs/API_KEYS_SETUP.md for detailed instructions on getting API keys.\n');

const questions = [
  {
    key: 'NEWSAPI_KEY',
    prompt: '📰 NewsAPI Key (from newsapi.org): ',
    required: true,
    info: 'Get free key at: https://newsapi.org/register'
  },
  {
    key: 'GNEWS_API_KEY',
    prompt: '📰 GNews API Key (from gnews.io): ',
    required: true,
    info: 'Get free key at: https://gnews.io/register'
  },
  {
    key: 'OPENAI_API_KEY',
    prompt: '🤖 OpenAI API Key (optional, for better analysis): ',
    required: false,
    info: 'Get key at: https://platform.openai.com/api-keys'
  },
  {
    key: 'ALPHA_VANTAGE_API_KEY',
    prompt: '📊 Alpha Vantage Key (optional, for commodity prices): ',
    required: false,
    info: 'Get free key at: https://www.alphavantage.co/support/#api-key'
  }
];

async function askQuestion(question) {
  return new Promise((resolve) => {
    console.log(`\n${question.info}`);
    rl.question(question.prompt, (answer) => {
      if (!answer && question.required) {
        console.log('❌ This key is required! Please enter a valid key.');
        resolve(askQuestion(question));
      } else {
        resolve(answer || null);
      }
    });
  });
}

async function main() {
  const answers = {};

  for (const question of questions) {
    const answer = await askQuestion(question);
    if (answer) {
      answers[question.key] = answer;
    }
  }

  // Read current .env file
  let envContent = '';
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Update API keys
  for (const [key, value] of Object.entries(answers)) {
    const regex = new RegExp(`^${key}=.*$`, 'm');
    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
      envContent += `\n${key}=${value}`;
    }
  }

  // Write back to .env
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ API keys configured successfully!');
  console.log('\n📝 Updated file: backend/.env');
  console.log('\n🚀 Next steps:');
  console.log('   1. Restart backend: npm run dev:backend');
  console.log('   2. Check logs for "Running initial news oracle..."');
  console.log('   3. Open game and click "News" button');
  console.log('\n🎮 Enjoy real-world news in your game!\n');

  rl.close();
}

main().catch(console.error);

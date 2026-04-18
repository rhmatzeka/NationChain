#!/usr/bin/env node

import 'dotenv/config';

const config = {
  newsApiKey: process.env.NEWSAPI_KEY,
  gnewsApiKey: process.env.GNEWS_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  alphaVantageKey: process.env.ALPHA_VANTAGE_API_KEY
};

console.log('\n🧪 Testing API Keys...\n');

async function testNewsAPI() {
  if (!config.newsApiKey || config.newsApiKey === 'your_newsapi_key') {
    console.log('⚠️  NewsAPI: Not configured');
    return false;
  }

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=geopolitics&pageSize=5&apiKey=${config.newsApiKey}`
    );
    const data = await response.json();

    if (data.status === 'ok') {
      console.log(`✅ NewsAPI: Working! (${data.totalResults} articles available)`);
      return true;
    } else {
      console.log(`❌ NewsAPI: Error - ${data.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ NewsAPI: Failed - ${error.message}`);
    return false;
  }
}

async function testGNews() {
  if (!config.gnewsApiKey || config.gnewsApiKey === 'your_gnews_key') {
    console.log('⚠️  GNews: Not configured');
    return false;
  }

  try {
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=geopolitics&max=5&apikey=${config.gnewsApiKey}`
    );
    const data = await response.json();

    if (data.articles) {
      console.log(`✅ GNews: Working! (${data.articles.length} articles fetched)`);
      return true;
    } else {
      console.log(`❌ GNews: Error - ${data.errors?.[0] || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ GNews: Failed - ${error.message}`);
    return false;
  }
}

async function testOpenAI() {
  if (!config.openaiApiKey || config.openaiApiKey === 'sk-your_openai_key') {
    console.log('⚠️  OpenAI: Not configured (optional)');
    return false;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${config.openaiApiKey}`
      }
    });
    const data = await response.json();

    if (data.data) {
      console.log(`✅ OpenAI: Working! (${data.data.length} models available)`);
      return true;
    } else {
      console.log(`❌ OpenAI: Error - ${data.error?.message || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ OpenAI: Failed - ${error.message}`);
    return false;
  }
}

async function testAlphaVantage() {
  if (!config.alphaVantageKey || config.alphaVantageKey === 'your_alpha_vantage_key') {
    console.log('⚠️  Alpha Vantage: Not configured (optional)');
    return false;
  }

  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=${config.alphaVantageKey}`
    );
    const data = await response.json();

    if (data['Global Quote']) {
      console.log(`✅ Alpha Vantage: Working!`);
      return true;
    } else {
      console.log(`❌ Alpha Vantage: Error - ${data.Note || data['Error Message'] || 'Unknown error'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Alpha Vantage: Failed - ${error.message}`);
    return false;
  }
}

async function main() {
  const results = await Promise.all([
    testNewsAPI(),
    testGNews(),
    testOpenAI(),
    testAlphaVantage()
  ]);

  const working = results.filter(Boolean).length;
  const total = 4;

  console.log(`\n📊 Summary: ${working}/${total} APIs configured and working`);

  if (results[0] || results[1]) {
    console.log('\n✅ News system ready! At least one news API is working.');
  } else {
    console.log('\n❌ No news APIs configured. Please run: node scripts/setup-api-keys.js');
  }

  console.log('\n📖 For setup instructions, see: docs/API_KEYS_SETUP.md\n');
}

main().catch(console.error);

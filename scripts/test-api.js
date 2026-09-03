const https = require('https');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function test() {
  try {
    const res = await fetchJson('https://lingva.ml/api/v1/de/en/hallo%20welt');
    console.log('Lingva:', res);
  } catch (e) {
    console.error('Lingva failed:', e.message);
  }
}

test();

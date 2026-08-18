const { exec } = require('child_process');
const { chromium } = require('playwright');

const server = exec('npx next dev -p 3456', { cwd: '/home/dhruv/Documents/prototype/1/dental-hero' });
server.stdout.on('data', d => process.stdout.write(d));
server.stderr.on('data', d => process.stderr.write(d));

setTimeout(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await page.goto('http://localhost:3456', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(20000);
    const loadingText = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log('Page text:', loadingText.replace(/\n/g, ' | '));
    await page.screenshot({ path: '/tmp/fix-hero8.png' });
    console.log('Screenshot saved');
    if (errors.length) errors.slice(0,5).forEach(e => console.log('ERR:', e.substring(0, 300)));
    await browser.close();
  } catch(e) {
    console.log('Error:', e.message.substring(0, 200));
  }
  server.kill();
  process.exit(0);
}, 15000);

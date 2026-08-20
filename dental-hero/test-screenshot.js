const { exec } = require('child_process');
const { chromium } = require('playwright');
const fs = require('fs');

const server = exec('npx next dev -p 3459', { cwd: '/home/dhruv/Documents/prototype/1/dental-hero' });
server.stdout.on('data', (d) => process.stdout.write(d));
server.stderr.on('data', (d) => process.stderr.write(d));

setTimeout(async () => {
  try {
    const browser = await chromium.launch({ 
      headless: true,
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--disable-gpu-sandbox']
    });

    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3459', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(8000);
    
    const buf = await page.screenshot({ type: 'png', timeout: 60000 });
    fs.writeFileSync('/tmp/dental-hero-v3.png', buf);
    console.log('Saved hero');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight - 900));
    await page.waitForTimeout(1000);
    const buf2 = await page.screenshot({ type: 'png', timeout: 60000 });
    fs.writeFileSync('/tmp/dental-hero-v3-footer.png', buf2);
    console.log('Saved footer');

    await browser.close();
  } catch (e) {
    console.log('Error:', e.message);
  }
  server.kill();
  process.exit(0);
}, 12000);
